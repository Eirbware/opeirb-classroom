import { get } from 'svelte/store';
import { userData, userProgress } from '../../stores/user'
import type { User as PocketBaseUser } from './pocketbase.types'; 
import * as PocketBaseModule from './pocketbase';
import { nullablePropertiesToOptional, isNotEmpty } from '../../util/helpers';
import { cloneDeep } from 'lodash';

function setUserData(data: PocketBaseModule.UserDataType) {
  userData.set(nullablePropertiesToOptional(data));
}
function setProgressData(
  data: PocketBaseModule.ProgressDataType | PocketBaseModule.ProgressDataType[],
  mustDelete = false
) {
  const arrayData = Array.isArray(data) ? data : [data];
  if (!mustDelete)
    userProgress.update((userProgressOldVal) => arrayData.reduce(
      (oldProgressState, data) => {
        const oldXpForPointedRoute = oldProgressState.xpPerRoute[data.course_route];
        const newXpForPointedRoute = (data.xp ?? 0);
        oldProgressState.xp += newXpForPointedRoute - (oldXpForPointedRoute ?? 0);
        oldProgressState.xpPerRoute[data.course_route] = newXpForPointedRoute;
        oldProgressState.markIdToRoute[data.mark_id] = data.course_route;
        return oldProgressState;
      },
      userProgressOldVal ?? { xp: 0, markIdToRoute: {}, xpPerRoute: {} })
    );
  else
    userProgress.update((userProgressOldVal) => {
    if (userProgressOldVal === null) {
      console.error("A mark has been deleted while the user was not supposed to own any");
      return userProgressOldVal;
    }
    return arrayData.reduce(
      (oldProgressState, { mark_id: markIdToDelete }) => {
        const routeToDelete = oldProgressState.markIdToRoute[markIdToDelete];
        const xpToRemove = oldProgressState.xpPerRoute[routeToDelete];
        const newProgressState = cloneDeep(oldProgressState);
        newProgressState.xp -= xpToRemove;
        delete newProgressState.xpPerRoute[routeToDelete];
        delete newProgressState.markIdToRoute[markIdToDelete];
        return newProgressState;
      },
      userProgressOldVal
    )
  });
}

function emptyWritables() {
  userData.set(null);
  userProgress.set(null);
}
async function fetchUserDataAndSetWritables(authenticatedUser: PocketBaseUser) {
  try {
    const userUid = authenticatedUser.id;
    const userProfileData = await PocketBaseModule.
      fetchUserProfileData(authenticatedUser);
    setUserData(userProfileData);
    const userProgressData = await PocketBaseModule.
      fetchUserProgressData(userUid);
    setProgressData(userProgressData);
  } catch(err) {
    console.error("Error in initial data fetching:\n\t" + err);
  }
}

let unsubData: PocketBaseModule.CustomUnsubscriber | null = null;
let unsubProgress: PocketBaseModule.CustomUnsubscriber | null = null;

function startChannels(authenticatedUser: PocketBaseUser) {
  if (unsubData === null)
  unsubData = PocketBaseModule.onUserProfileDataChange(authenticatedUser, (payload) => {
    const data = payload;
    if (isNotEmpty(data)) setUserData(data);
  });
  if (unsubProgress === null)
  unsubProgress = PocketBaseModule.onUserProgressDataChange(authenticatedUser, (payload) => {
    if (payload.isRecordDeleted)
      setProgressData(payload, true);
    else
      setProgressData(payload);
  });
}
async function stopChannels() {
  unsubData && (await unsubData)();
  unsubProgress && (await unsubProgress)();
  unsubData = null;
  unsubProgress = null;
}

/** Initially set writables if the user is already authenticated;
 *
 * Returns a function to unsubscribe every watcher (database + auth).
 *
 * Call this function when mounting one single component in the static page,
 * e.g. the global-data component.
 *
 */
async function fetchAndWatchUserRemoteData() {
  // Perform a session refreshing, if needed.
  const authenticatedUser: PocketBaseUser | null = PocketBaseModule.getUserFromSession();
  if (authenticatedUser) {
    startChannels(authenticatedUser);
  }
  
  const subscription = PocketBaseModule.
  onAuthStateChange(async (authenticatedUser) => {
    if (authenticatedUser) {
      startChannels(authenticatedUser);
      if (
        get(userData) === null ||  get(userProgress) === null
      )
        await fetchUserDataAndSetWritables(authenticatedUser);
    } else {
      emptyWritables();
      stopChannels();
    }
  });
  return () => { subscription.unsubscribe(); stopChannels(); };
};

export { fetchAndWatchUserRemoteData };

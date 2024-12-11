import { get } from "svelte/store";
import { userData, userProgress, type UserData } from "../../stores/user";
import type { User as PocketBaseUser } from "./pocketbase.types";
import * as PocketBaseModule from "./pocketbase";
import { cloneDeep } from "lodash";

function setUserData(data: PocketBaseModule.UserDataType) {
  const u: UserData = {
    uid: data.id,
    email: data.email,
    displayName: data.name,
    photoURL: data.avatar,
  };
  userData.set(u);
}
function setProgressData(
  data: PocketBaseModule.ProgressDataType,
  mustDelete = false,
) {
  const arrayData = Array.from(data.validatedChapters.keys());
  if (!mustDelete)
    userProgress.update((userProgressOldVal) =>
      arrayData.reduce(
        (oldProgressState, chapterId) => {
          const chapter = data.validatedChapters.get(chapterId);
          if (chapter === undefined)
            throw new Error("Wrong encoded progress data");
          oldProgressState.xpPerRoute[chapter.uri] = chapter.xp;
          oldProgressState.markIdToRoute[chapterId] = chapter.uri;
          oldProgressState.xp = data.xp;
          return oldProgressState;
        },
        userProgressOldVal ?? {
          xp: data.xp,
          markIdToRoute: {},
          xpPerRoute: {},
        },
      ),
    );
  else
    userProgress.update((userProgressOldVal) => {
      if (userProgressOldVal === null) {
        console.error(
          "A mark has been deleted while the user was not supposed to own any",
        );
        return userProgressOldVal;
      }
      return arrayData.reduce((oldProgressState, chapterId) => {
        const chapter = data.validatedChapters.get(chapterId);
        if (chapter === undefined)
          throw new Error("Wrong encoded progress data");
        const newProgressState = cloneDeep(oldProgressState);
        delete newProgressState.xpPerRoute[chapter.uri];
        delete newProgressState.markIdToRoute[chapterId];
        newProgressState.xp = data.xp;
        return newProgressState;
      }, userProgressOldVal);
    });
}

function emptyWritables() {
  userData.set(null);
  userProgress.set(null);
}
async function fetchUserDataAndSetWritables(authenticatedUser: PocketBaseUser) {
  try {
    const userUid = authenticatedUser.id;
    const userProfileData =
      await PocketBaseModule.fetchUserProfileData(authenticatedUser);
    setUserData(userProfileData);
    const userProgressData =
      await PocketBaseModule.fetchUserProgressData(userUid);
    setProgressData(userProgressData);
  } catch (err) {
    console.error("Error in initial data fetching:\n\t" + err);
  }
}

let unsubData: PocketBaseModule.CustomUnsubscriber | null = null;
let unsubProgress: PocketBaseModule.CustomUnsubscriber | null = null;

async function startChannels(authenticatedUser: PocketBaseUser) {
  // if (unsubData === null)
  //   unsubData = await PocketBaseModule.onUserProfileDataChange(
  //     authenticatedUser,
  //     (payload) => {
  //       const data = payload;
  //       setUserData(data);
  //     },
  //   );
  if (unsubProgress === null)
    unsubProgress = await PocketBaseModule.onUserProgressDataChange(
      authenticatedUser,
      (payload) => {
        if (payload.isRecordDeleted) setProgressData(payload, true);
        else setProgressData(payload);
      },
    );
}
async function stopChannels() {
  unsubData && await unsubData();
  unsubProgress && await unsubProgress();
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
  const authenticatedUser: PocketBaseUser | null =
    PocketBaseModule.getUserFromSession();
  if (authenticatedUser) {
    await startChannels(authenticatedUser);
  }

  const subscription = PocketBaseModule.onAuthStateChange(
    async (authenticatedUser) => {
      if (authenticatedUser) {
        await startChannels(authenticatedUser);
        if (get(userData) === null || get(userProgress) === null)
          await fetchUserDataAndSetWritables(authenticatedUser);
      } else {
        emptyWritables();
        await stopChannels();
      }
    },
  );
  return async () => {
    subscription.unsubscribe();
    await stopChannels();
  };
}

export { fetchAndWatchUserRemoteData };

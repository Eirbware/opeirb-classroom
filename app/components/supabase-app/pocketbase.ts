import PocketBase, {
  ClientResponseError,
  LocalAuthStore,
  type RecordAuthResponse,
  type UnsubscribeFunc,
} from "pocketbase";
import { Subject } from "rxjs";

import { toast } from "../../stores/toast";
import { modal } from "../../stores/modal";
import type {
  Chapter,
  ExpandedValidation,
  OCPocketBase,
  RankedUser,
  User,
  Validation,
} from "./pocketbase.types";

const localAuthStore = new LocalAuthStore("PB_CACHED_USER");

const pocketbaseClient = new PocketBase(
  "http://localhost:8090",
  localAuthStore,
) as OCPocketBase;
const currentUser = new Subject<User | null>();

/** @return The loaded user from the session
 * Call this promise at the refreshing of each static page so the
 * pocketbaseClient can next correctly perform its requests.
 */
export function getUserFromSession() {
  const cachedRecord = pocketbaseClient.authStore.record;
  let user: User | null = null;
  if (cachedRecord !== null) user = cachedRecord as unknown as User;
  return user;
}

// Login

export async function signInWithGithub() {
  // TODO: fix for Safari as documented
  const credential = pocketbaseClient
    .collection("users")
    .authWithOAuth2({ provider: "github", redirectTo: window.location.href });
  return loginHandler(credential);
}

export async function signInWithEirbConnect() {
  // TODO: fix for Safari as documented
  const credential = pocketbaseClient
    .collection("users")
    .authWithOAuth2({ provider: "oidc", redirectTo: window.location.href });
  return loginHandler(credential);
}

export async function pocketbaseSignOut() {
  pocketbaseClient.authStore.clear();
  toast.set({
    icon: "👋",
    message: "Thanks for hanging out, see ya around!",
  });
}

async function loginHandler(promise: Promise<RecordAuthResponse<User>>) {
  try {
    const authData = await promise;
    currentUser.next(authData.record);
    modal.set(null);
    toast.set({
      message: "Access granted! Logged into the mainframe!",
      type: "success",
    });
    return { res: authData, serverError: null };
  } catch (error) {
    if (error instanceof ClientResponseError) {
      const serverError = error.message;
      console.error(error);
      toast.set({
        message: serverError,
        type: "error",
      });
      return { res: null, serverError };
    }
    throw error;
  }
}

// Select user data

export type ProgressDataType = {
  xp: number;
  validatedChapters: Map<string, Omit<Chapter, "id">>;
};

export async function fetchUserProfileData(user: User): Promise<User> {
  try {
    const gotUser = await pocketbaseClient.collection("users").getOne(user.id);
    return gotUser;
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404)
      throw new Error("unable to correctly fetch user data: " + error.message);
    throw error;
  }
}

export async function fetchUserProgressData(
  userUid: string,
): Promise<ProgressDataType> {
  try {
    const totalXpView = await pocketbaseClient.collection("ranked").getOne(userUid);
    const validatedChapters = await pocketbaseClient
      .collection("validate")
      .getFullList<ExpandedValidation>({
        filter: `user = ${userUid}`,
        expand: "chapter",
        fields: "chapter",
      });
    return validatedChapters.reduce<ProgressDataType>(
      (oldProgressData, validatedChapterByUser) => {
        const new_p = {
          xp: oldProgressData.xp,
          validatedChapters: new Map(oldProgressData.validatedChapters),
        };
        const { id: chapterId, ...chapterData } = validatedChapterByUser.chapter;
        new_p.validatedChapters.set(chapterId, chapterData);
        return new_p;
      },
      { xp: totalXpView.total_xp, validatedChapters: new Map() },
    );
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404)
      throw new Error(
        "unable to correctly fetch user progress data: " + error.message,
      );
    throw error;
  }
}

// Realtime Watchers

type AuthCallback = (user: User | null) => void;

export const onAuthStateChange = (callback: AuthCallback) =>
  currentUser.subscribe({ next: (user) => callback(user) });

// Encapsulate the Supabase RealtimeChannel into a function just to leave
// the channel.
export type CustomUnsubscriber = Promise<UnsubscribeFunc>;

type Callback<T extends { [key: string]: any }> = (payload: T) => void;
type OnF<T extends { [key: string]: any }> = (
  sbUser: User,
  callback: Callback<T>,
) => CustomUnsubscriber;
export type UserDataType = User;

export const onUserProgressDataChange: OnF<
  { isRecordDeleted: boolean } & ProgressDataType
> = (sbUser, callback) =>
  pocketbaseClient.collection("validate").subscribe<ExpandedValidation>(
    "*",
    async (d) => {
      const newRank = await pocketbaseClient
        .collection("ranked")
        .getOne(sbUser.id);
      const mapToDelete = new Map();
      const { id: chapterId, ...chapterData } = d.record.chapter;
      mapToDelete.set(chapterId, chapterData);
      callback({ isRecordDeleted: d.action === "delete", xp: newRank.total_xp, validatedChapters: mapToDelete });
    },
    { filter: `user = ${sbUser.id}`, expand: "chapter", fields: "chapter" },
  );

export const onUserProfileDataChange: OnF<UserDataType> = (sbUser, callback) =>
  pocketbaseClient
    .collection("users")
    .subscribe(sbUser.id, (d) => callback(d.record));

// Callable Functions

/** This function runs whatever pocketbase db request only for an authenticated user
 */
function callIfAuthenticated<T>(
  fn: (user: User) => Promise<T>,
): () => Promise<T | null> {
  return async () => {
    const user = getUserFromSession();
    if (!user) {
      modal.set("signin");
      toast.set({ message: "You must be signed in first", type: "info" });
      return null;
    }
    try {
      console.log("starting pocketbase request...");
      const res = await fn(user);
      console.log("request done!");
      return res;
    } catch (error) {
      console.error(error);
      toast.set({
        message:
          error instanceof ClientResponseError
            ? error.message
            : "Unknown Error. Contact eirbware@enseirb-matmeca.fr for help",
        type: "error",
      });
      return null;
    }
  };
}

// RGPD

export async function deleteUserData() {
  return await callIfAuthenticated(
    async (user: User) =>
      await pocketbaseClient.collection("users").delete(user.id),
  )();
}

// Progress Tracking

export async function markComplete(route: string, bonus = 0) {
  return await callIfAuthenticated(async (user) => {
    let chapter: Chapter;
    try {
      chapter = await pocketbaseClient
        .collection("chapters")
        .getFirstListItem(`uri = ${route}`);
    } catch (e) {
      if (!(e instanceof ClientResponseError) || e.status !== 404)
        throw new Error("unhandled exception");
      // 404 error : the chapter must be created
      chapter = await pocketbaseClient
        .collection("chapters")
        .create({ uri: route, xp: 150 + bonus });
    }
    return await pocketbaseClient
      .collection("validate")
      .create({ chapter: chapter.id, user: user.id });
  })();
}

export async function markIncomplete(route: string) {
  await callIfAuthenticated(async (user) => {
    let validation: Validation;
    try {
      const chapter = await pocketbaseClient
        .collection("chapters")
        .getFirstListItem(`uri = ${route}`);
      validation = await pocketbaseClient
        .collection("validate")
        .getFirstListItem(`chapter = ${chapter.id} && user = ${user.id}`);
    } catch (e) {
      if (e instanceof ClientResponseError && e.status === 404)
        throw new Error("not found ressource:" + e.message);
      throw new Error("unhandled exception");
    }
    return await pocketbaseClient.collection("validate").delete(validation.id);
  })();
}

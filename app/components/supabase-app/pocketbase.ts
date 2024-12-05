import PocketBase, {
  ClientResponseError,
  LocalAuthStore,
  RecordService,
  type RecordAuthResponse,
  type RecordSubscription,
} from "pocketbase";
import { Subject } from "rxjs";

import { toast } from "../../stores/toast";
import { modal } from "../../stores/modal";
import type { OCPocketBase, User } from "./pocketbase.types";

const USER_ID_KEY__USERS: UsersTableKey = "uid";
const USER_ID_KEY__PROGRESS: ProgressTableKey = "user_id";
const COURSE_ROUTE_KEY__PROGRESS: ProgressTableKey = "course_route";

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
export function refreshUserSession() {
  const cachedRecord = pocketbaseClient.authStore.record;
  if (cachedRecord === null) currentUser.next(null);
  else currentUser.next(cachedRecord as unknown as User);
  return currentUser;
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

export async function fetchUserProfileData(user: User) {
  try {
    const gotUser = await pocketbaseClient
      .collection("users")
      .getOne(user.id);
    return gotUser;
  } catch(error) {
    if (error instanceof ClientResponseError)
      throw new Error("unable to correctly fetch user data: " + error.message);
    throw error;
  }
}

export async function fetchUserProgressData(userUid: string) {
  try {
    return await pocketbaseClient
      .collection("ranked")
      .getOne(userUid);
  } catch(error) {
    if (error instanceof ClientResponseError)
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
export type CustomUnsubscriber = () => ReturnType<
  RealtimeChannel["unsubscribe"]
>;

type OnType<T extends { [key: string]: any }> = (
  type: `${REALTIME_LISTEN_TYPES.POSTGRES_CHANGES}`,
  filter: RealtimePostgresChangesFilter<`${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL}`>,
  callback: (payload: RealtimePostgresChangesPayload<T>) => void,
) => CustomUnsubscriber;

function createChannelForAllPostgresChanges<T extends { [key: string]: any }>(
  channelKey: string,
): (
  filter: Parameters<OnType<T>>[1],
  callback: Parameters<OnType<T>>[2],
) => CustomUnsubscriber {
  const onFunction: OnType<T> = (type, filter, callback) => {
    const realtimeChannel = pocketbaseClient
      .channel(channelKey)
      .on<T>(type, filter, callback)
      .subscribe();
    return () => realtimeChannel.unsubscribe();
  };
  return (filter, callback) => onFunction("postgres_changes", filter, callback);
}

// TODO: change all below

type Callback<T extends { [key: string]: any }> = (
  payload: RealtimePostgresChangesPayload<T>,
) => void;
export type UserDataType =
  SupabaseTypes.Database["public"]["Tables"]["users"]["Row"];
export type ProgressDataType =
  SupabaseTypes.Database["public"]["Tables"]["progress"]["Row"];

export const onUserProgressDataChange = (
  sbUser: User,
  callback: Callback<ProgressDataType>,
) =>
  createChannelForAllPostgresChanges<ProgressDataType>("progress_change")(
    {
      event: "*",
      schema: "public",
      table: "progress",
      filter: `${USER_ID_KEY__PROGRESS}=eq.${sbUser.id}`,
    },
    callback,
  );

export const onUserProfileDataChange = (
  sbUser: User,
  callback: Callback<UserDataType>,
) =>
  createChannelForAllPostgresChanges<UserDataType>("user_change")(
    {
      event: "*",
      schema: "public",
      table: "users",
      filter: `${USER_ID_KEY__USERS}=eq.${sbUser.id}`,
    },
    callback,
  );

// Callable Functions

/** This function runs whatevej postgres request only for an authenticated user
 */
function callIfAuthenticated<
  Params extends any[],
  Err extends { message: string },
  PostgresResult extends { error: Err | null },
>(
  fn: (user: User, ...params: Params) => Promise<PostgresResult>,
): (...params: Params) => Promise<PostgresResult | null> {
  return async (...params: Params) => {
    const user = currentUser;
    if (!user) {
      modal.set("signin");
      toast.set({ message: "You must be signed in first", type: "info" });
      return null;
    }
    try {
      console.log("starting supabase request...");
      const res = await fn(user, ...params);
      const error = res.error;
      if (error) throw error;
      console.log("request done!");
      return res;
    } catch (error: any) {
      console.error(error);
      toast.set({
        message:
          error?.message ??
          "Unknown Error. Contact eirbware@enseirb-matmeca.fr for help",
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
      await pocketbaseClient.from("users").delete().eq("uid", user.id),
  )();
}

// Progress Tracking

export async function markComplete(route: string, bonus = 0) {
  await callIfAuthenticated(async (user) =>
    pocketbaseClient
      .from("progress")
      .upsert(
        {
          user_id: user.id,
          course_route: route,
          xp: 100 + bonus,
        },
        {
          onConflict: `${USER_ID_KEY__PROGRESS},${COURSE_ROUTE_KEY__PROGRESS}`,
        },
      )
      .select(),
  )();
}

export async function markIncomplete(route: string) {
  await callIfAuthenticated(
    async (user) =>
      await pocketbaseClient
        .from("progress")
        .delete()
        .eq("user_id", user.id)
        .eq("course_route", route),
  )();
}

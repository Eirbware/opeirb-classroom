import { pocketbaseSide } from "../../stores/pocketbase-vars";
import {
  deleteUserData,
  markComplete,
  markIncomplete,
  signInWithEirbConnect,
  signInWithGithub,
  pocketbaseSignOut,
} from "./pocketbase";
import type { Unsubscriber } from "svelte/store";

export function listenAllPocketbaseEvents(): Unsubscriber[] {
  return [
    pocketbaseSide.onSignIn(async (provider) => {
      if (provider === "github") await signInWithGithub();
      else await signInWithEirbConnect();
    }),

    pocketbaseSide.onSignOut(async () => {
      await pocketbaseSignOut();
    }),

    pocketbaseSide.onUserDataDelete(async () => {
      await deleteUserData();
    }),

    pocketbaseSide.onCourseMarked(async (markData) => {
      await markComplete(markData.route, markData.bonus);
    }),
    pocketbaseSide.onCourseUnmarked(async (markData) => {
      await markIncomplete(markData.route);
    }),
  ];
}

export function unsubcribeAll(unsubscribers: Unsubscriber[]) {
  unsubscribers.forEach((u) => u());
}

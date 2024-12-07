import { supabaseSide } from "../../stores/supabase-vars";
import {
  deleteUserData,
  markComplete,
  markIncomplete,
  signInWithEirbConnect,
  signInWithGithub,
  pocketbaseSignOut,
} from "./pocketbase";
import type { Unsubscriber } from "svelte/store";

export function listenAllSupabaseEvents(): Unsubscriber[] {
  return [
    supabaseSide.onSignIn(async (provider) => {
      if (provider === "github") await signInWithGithub();
      else await signInWithEirbConnect();
    }),

    supabaseSide.onSignOut(async () => {
      await pocketbaseSignOut();
    }),

    supabaseSide.onUserDataDelete(async () => {
      await deleteUserData();
    }),

    supabaseSide.onCourseMarked(async (markData) => {
      await markComplete(markData.route, markData.bonus);
    }),
    supabaseSide.onCourseUnmarked(async (markData) => {
      await markIncomplete(markData.route);
    }),
  ];
}

export function unsubcribeAll(unsubscribers: Unsubscriber[]) {
  unsubscribers.forEach((u) => u());
}

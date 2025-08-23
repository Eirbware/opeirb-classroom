import { derived, writable } from "svelte/store";
import { siteData } from "./data";

export interface UserData {
  email?: string;
  uid?: string;
  displayName?: string;
  photoURL?: string;
  discordId?: string;
}

export interface UserProgress {
  xp: number;
  markIdToRoute: Record<string, keyof UserProgress["xpPerRoute"]>;
  xpPerRoute: Record<string, number>;
};

const userData = writable<UserData | null>(null);
const userProgress = writable<UserProgress | null>(null);

const canAccess = derived(
  // TODO: remove this if useless or restrict access if needed
  [userData, siteData],
  ([$userData, $siteData]) => {
    return true;
  },
);

export { userData, userProgress, canAccess };

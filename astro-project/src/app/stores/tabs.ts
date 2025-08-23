import { writable } from "svelte/store";

// Store the chosen tab title for each tab set
// TODO: limit the number of stored tab set with a history of the most recently
// used ones
export const chosenTabs = writable<Record<string, string> | null>(null);

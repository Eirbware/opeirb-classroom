import { writable } from "svelte/store";

export const autoplay = writable<boolean | null>(null);

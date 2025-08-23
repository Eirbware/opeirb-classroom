import { writable } from "svelte/store";

export type SettableBoolean = boolean | null;

const doesPreferDark = writable<boolean | null>(null);

export { doesPreferDark };

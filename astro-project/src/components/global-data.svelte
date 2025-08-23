<!-- Component to initiate the persistent stores. -->

<script lang="ts">
  import type { Unsubscriber, Writable } from "svelte/store";
  import { onMount } from "svelte";
  import { siteData } from "../app/stores/data";
  import { chosenTabs, doesPreferDark } from "../app/stores";
  import { autoplay } from "../app/stores";

  export let permalink: string;
  export let next: string;
  export let prev: string;
  export let vimeo: string;
  export let youtube: string;
  export let free: string;

  onMount(() => {

    /** Create a writable and sync it with the browser localStorage
      * with the provided key. Expect the initial value of the writable
      * to equal null.
      */
    function syncWritableToLocalStorage<T>(writable: Writable<T | null>, store_key: string) {
      const unsubscriber = writable.subscribe(v => {
        if (v === null) localStorage.removeItem(store_key);
          else localStorage.setItem(store_key, JSON.stringify(v));
      });
      const cachedValue = localStorage.getItem(store_key);
      if (cachedValue !== null) {
        writable.set(JSON.parse(cachedValue) as T);
      }
      return unsubscriber;
    }

    const unsubscribers: Unsubscriber[] = [
      syncWritableToLocalStorage(autoplay, "autoplay"),
      syncWritableToLocalStorage(doesPreferDark, "dark_mode"),
      syncWritableToLocalStorage(chosenTabs, "chosen_tabs")
    ]
    autoplay.update(v => v === null ? true: v);


    siteData.set({ permalink, next, prev, vimeo, free, youtube });

    return () => { unsubscribers.forEach(unsubscriber => unsubscriber()); };

  });
</script>

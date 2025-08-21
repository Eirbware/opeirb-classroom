<script lang="ts">
  import { onMount } from "svelte";
  import { fetchAndWatchUserRemoteData } from "./user-store-sync";
  import { listenAllPocketbaseEvents, unsubcribeAll } from "./listen-events";

  onMount(() => {
    window.addEventListener(
      "flamethrower:router:end", // when a page has ended to load
      async () => {
        const userDataSubscription = await fetchAndWatchUserRemoteData();
        const pocketbaseSvelteStoresSubscriptions = listenAllPocketbaseEvents();

        window.addEventListener(
          "flamethrower:router:fetch", // when a new page starts to be fetched
          async () => {
            if (userDataSubscription) await userDataSubscription();
            unsubcribeAll(pocketbaseSvelteStoresSubscriptions);
          },
          { once: true },
        );
      },
      { once: true },
    );
  });
</script>

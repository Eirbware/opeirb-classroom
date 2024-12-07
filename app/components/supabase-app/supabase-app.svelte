<svelte:options customElement="supabase-app" />

<script lang="ts">
  import { onMount } from "svelte";
  import { fetchAndWatchUserRemoteData } from "./user-store-sync";
  import { listenAllSupabaseEvents, unsubcribeAll } from "./listen-events";

  onMount(() => {
    window.addEventListener(
      "flamethrower:router:end",
      async () => {
        console.log("Ending new page loading. Trying subscribing...");
        const userDataSubscription = await fetchAndWatchUserRemoteData();
        const supabaseSvelteStoresSubscriptions = listenAllSupabaseEvents();
        console.log("sub done");

        window.addEventListener(
          "flamethrower:router:fetch",
          async () => {
            console.log("Leaving page. Trying unsubscribing...");
            if (userDataSubscription) await userDataSubscription();
            unsubcribeAll(supabaseSvelteStoresSubscriptions);
            console.log("unsub done");
          },
          { once: true },
        );
      },
      { once: true },
    );
  });
</script>

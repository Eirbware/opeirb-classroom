<script lang="ts">
  import { onMount } from "svelte";
  import { routeLoading } from "../../app/stores/loading";

  onMount(() => {
      let timeout: NodeJS.Timeout;
      // TODO: replace this by the ClientRouter API
      window.addEventListener("flamethrower:router:fetch", (e) => {
        // delay for loads > 250ms
        timeout = setTimeout(() => {
          routeLoading.set(true);
        }, 0);
      });
      window.addEventListener("flamethrower:router:end", (e) => {
        // show for at least 400ms
        clearTimeout(timeout);
        setTimeout(() => {
          routeLoading.set(false);
        }, 400);
});
  })
</script>

<div class="gradient-loader" class:show={$routeLoading}></div>

<style lang="scss">
  div {
    @apply fixed w-full top-0 left-0 h-1.5 opacity-0 -translate-x-full transition-all;
  }
  .show {
    @apply opacity-100 translate-x-0;
  }
  .gradient-loader {
    @apply bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500;
    background-size: 200% 200%;
    animation: gradiant-move 1s infinite;
  }
  @keyframes gradiant-move {
    0% {
      background-position: left;
    }
    50% {
      background-position: right;
    }
    100% {
      background-position: left;
    }
  }
</style>

<script>
  import { componentsSide } from "../../app/stores/pocketbase-vars";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span role="button" tabindex="0" on:click={() => componentsSide.signOut()}>
  <slot></slot>
</span>

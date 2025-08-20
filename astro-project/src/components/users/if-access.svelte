<script lang="ts">
  import { canAccess } from "../../app/stores/user";
  export let free = false;
</script>

{#if free || $canAccess}
  <slot name="granted"></slot>
{:else}
  <slot name="denied"></slot>
{/if}

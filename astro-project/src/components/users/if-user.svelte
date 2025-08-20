<!-- Is signed in  -->

<script lang="ts">
  import { userData } from "../../app/stores/user";
</script>

{#if $userData}
  <slot></slot>
{:else}
  <slot name="signed-out"></slot>
{/if}

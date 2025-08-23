<script lang="ts">
  import { modal } from "../../app/stores/modal";
  import { onMount } from "svelte";
  // TODO: make this component work when the pages will be ready
  // import { flexSearch, initFlexSearchIndex } from "./flexsearch-manager";
  import type { FoundPageData } from "./flexsearch-manager";
  import ModalDialog from "../ui/modal-dialog.svelte";

  // initFlexSearchIndex();

  let inputTag: HTMLInputElement;
  let results: FoundPageData[];
  let activeHit = 0;

  function focusInput(el: HTMLInputElement) {
    el.focus();
  }
  onMount(() => {
    return () => {
      window.removeEventListener("keydown", handleSpecialKeys);
    };
  });

  async function search(e: Event) {
    const q = (e.target as HTMLInputElement).value;
    const fResults: FoundPageData[] = []; // await flexSearch(q, 7);
    results = fResults;
  }

  function goUp() {
    activeHit = activeHit <= 0 ? activeHit : activeHit - 1;
  }
  function goDown() {
    activeHit = activeHit >= (results?.length || 0) - 1 ? activeHit : activeHit + 1;
  }
  function selectHit() {
    if (results[activeHit]) {
      // const url = results[activeHit].relpermalink;
      // TODO: change the page
      // router.go(url);
      modal.set(null);
    }
  }
  function handleSpecialKeys(e: KeyboardEvent) {
    if (e.key === "ArrowUp") {
      goUp();
    }
    if (e.key === "ArrowDown") {
      goDown();
    }
    if (e.key === "Enter") {
      selectHit();
    }
  }
</script>

<svelte:window on:keydown={handleSpecialKeys} />

<ModalDialog name="search">
  {#if $modal === "search"}
    <form>
      <!-- svelte-ignore a11y-autofocus -->
      <input
        class="input"
        name="search"
        type="text"
        placeholder="Search"
        on:input={search}
        use:focusInput
        bind:this={inputTag}
      />
    </form>
  {/if}

  <div class="results">
    {#if !results?.length}
      <p class="no-results">No results yet</p>
    {:else}
      {#each results as hit, i}
        <a
          class="hit"
          href={hit.relpermalink}
          class:active={i === activeHit}
          on:mouseover={() => (activeHit = i)}
          on:focus={() => (activeHit = i)}
        >
          <span class="hit-title">{hit.title}</span>
          <span class="hit-type"> in {hit.type}</span>
          <span class="hit-description">{@html hit.summary}</span>
        </a>
      {/each}
    {/if}
  </div>

  <footer>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <kbd role="button" tabindex="-1" on:click={selectHit}>↩</kbd>
    <span class="kbd-text">select</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <kbd role="button" tabindex="-1" on:click={goUp}>↑</kbd>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <kbd role="button" tabindex="-1" on:click={goDown}>↓</kbd>
    <span class="kbd-text">navigate</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <kbd role="button" tabindex="-1" on:click={() => modal.set(null)}>esc</kbd>
    <span class="kbd-text">leave</span>
  </footer>
</ModalDialog>

<style lang="scss">
  a,
  a:hover,
  a:focus,
  a:active {
    text-decoration: none;
    color: inherit;
  }
  form {
    @apply overflow-hidden;
  }
  .input {
    @apply bg-gray7/50 text-white w-full md:w-[768px] font-sans text-xl rounded-none block p-3 
             border-4 border-solid border-t-0 border-r-0 border-l-0 border-b-purple-500 outline-none focus-visible:outline-none mr-2;
  }
  .results {
    @apply max-w-full min-h-[200px];
  }
  .hit {
    @apply block no-underline font-sans p-4 my-2 border bg-gray7/50 shadow-md transition-all;
  }
  .hit-description {
    @apply text-gray3 text-sm block;
  }
  .hit-title {
    @apply text-lg font-bold;
  }
  .hit-type {
    @apply text-white font-light;
  }
  .no-results {
    @apply text-gray3 text-sm text-center;
  }

  .active {
    @apply bg-orange-500 text-white;
    .hit-description {
      @apply text-white;
    }
  }
  footer {
    @apply text-xs text-gray3 mt-6;
  }
  kbd {
    @apply text-gray3 cursor-pointer text-xs bg-transparent border border-solid rounded-md 
           border-orange-500 p-1.5 hover:bg-orange-500/50 hover:text-white transition-all;
  }
  .kbd-text {
    @apply mr-3;
  }
</style>

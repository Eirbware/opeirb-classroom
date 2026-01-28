<script lang="ts">
// Import necessary components from their individual files
import EirbConnectBtn from "@/components/ui/buttons/EirbConnectBtn.svelte";
import { useLoginModal } from "@/app/stores/loginModal.svelte";

// Variables for customization of the LoginModal Component
let {
  btnTitle = "Sign in", // Main HEADING
  subTitle = "Don't have an account yet?", // Sub-Heading TEXT
  registerBtn = "Sign up here", // Text for REGISTRATION BUTTON
} = $props();

const loginModal = useLoginModal();
let dialog: HTMLDialogElement | undefined = $state();
$effect(() => {
  if (loginModal.open) dialog?.showModal();

});
</script>

<dialog
  class="bg-transparent p-0"
  bind:this={dialog}
  onclose={() => (loginModal.hide())}
  onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
  <div
    class="transition-all ease-out mt-7 duration-500 sm:mx-auto sm:w-full sm:max-w-lg"
  >
    <div class="mx-auto w-full max-w-md">
      <div
        class="mt-7 rounded-xl border border-neutral-200 bg-neutral-100 shadow-xs dark:border-neutral-700 dark:bg-neutral-800"
      >
        <div class="p-4 sm:p-7">
          <div class="text-center">
            <div
              class="block text-2xl font-bold text-neutral-800 dark:text-neutral-200"
              role="heading"
              aria-level="1"
              aria-label={btnTitle}
            >
              {btnTitle}
            </div>
            <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {subTitle}
            </p>
          </div>
          <div class="mt-5">
            <!-- TODO: i18n -->
            <EirbConnectBtn title="Sign in with EirbConnect" />
          </div>
        </div>
      </div>
    </div>
  </div>
</dialog>

<style>
  dialog::backdrop {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3); /* semi-transparent backdrop */
  }

  /* With that the dialog center automatically according to the backdrop */
  dialog {
    margin: auto;
  }

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>

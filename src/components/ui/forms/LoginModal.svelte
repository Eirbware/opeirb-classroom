<script lang="ts">
// Import necessary components from their individual files
import EmailInput from "./input/EmailInput.svelte";
import PasswordInput from "./input/PasswordInput.svelte";
import Checkbox from "./input/Checkbox.svelte";
import AuthBtn from "@components/ui/buttons/AuthBtn.svelte";
import GoogleBtn from "@components/ui/buttons/GoogleBtn.svelte";
import { useLoginModal } from "@/app/stores/loginModal.svelte";

// Variables for customization of the LoginModal Component

const config = {
  id: "hs-toggle-between-modals-login-modal", // Modal IDENTIFIER
  title: "Sign in", // Main HEADING
  subTitle: "Don't have an account yet?", // Sub-Heading TEXT
  registerBtn: "Sign up here", // Text for REGISTRATION BUTTON
  registerBtnDataHS: "#hs-toggle-between-modals-register-modal", // TARGET LINK for registration button
};
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
              aria-label={config.title}
            >
              {config.title}
            </div>
            <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {config.subTitle}
              <button
                class="rounded-lg p-1 font-medium text-orange-400 decoration-2 outline-hidden ring-zinc-500 hover:underline focus-visible:ring-3 dark:text-orange-400 dark:ring-zinc-200 dark:focus:outline-hidden"
              >
                {config.registerBtn}
              </button>
            </p>
          </div>
          <div class="mt-5">
            <GoogleBtn title="Sign in with Google" />

            <div
              class="flex items-center py-3 text-xs uppercase text-neutral-400 before:me-6 before:flex-[1_1_0%] before:border-t before:border-neutral-200 after:ms-6 after:flex-[1_1_0%] after:border-t after:border-neutral-200 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600"
            >
              Or
            </div>
            <!-- The container for the form -->
            <form>
              <!-- A grid layout for the form fields -->
              <div class="grid gap-y-4">
                <!-- The email input field -->
                <EmailInput id="login-email" errorId="login-email-error" />
                <!-- The password input field -->
                <PasswordInput
                  forgot={true}
                  id="password"
                  errorId="login-password-error"
                  content="8+ characters required"
                />
                <!-- The remember-me checkbox -->
                <Checkbox id="remember-me" />
                <!-- The sign-in button -->
                <AuthBtn title="Sign in" />
              </div>
            </form>
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

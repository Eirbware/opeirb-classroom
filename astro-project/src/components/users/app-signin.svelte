<script lang="ts">
import GithubSignin from "./github-signin.svelte";
import RouladeSignin from "./roulade-signin.svelte";
</script>

<modal-dialog name="signin" esc="true">
  <h1>Connexion</h1>
  <p>Avec votre compte:</p>
  <GithubSignin />
  <RouladeSignin />
  <p class="footer">
    En vous connectant, vous consentez aux termes et service du site.
  </p>
</modal-dialog>

<style>
  .footer {
    @apply text-sm text-gray4;
  }
</style>

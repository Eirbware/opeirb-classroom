<script lang="ts">
import { pb, logout } from "@/app/pocketbase";
import { useUserData } from "@/app/stores/userData.svelte";

const userData = useUserData();

export let title: string;

const baseClasses =
  "inline-flex w-full items-center justify-center gap-x-2 rounded-lg px-4 py-3 text-sm dark:text-neutral-400 font-medium text-neutral-600 shadow-xs transition duration-300 focus-visible:ring-3 outline-hidden";
const borderClasses = "border border-neutral-200 dark:border-neutral-700";
const bgColorClasses =
  "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-900";
const disableClasses = "disabled:pointer-events-none disabled:opacity-50";
const ringClasses = "ring-zinc-500 dark:ring-zinc-200";
const logoutSVG = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.3531 21.8897 19.1752 21.9862 17 21.9983M9.00195 17C9.01406 19.175 9.11051 20.3529 9.87889 21.1213C10.5202 21.7626 11.4467 21.9359 13 21.9827" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

async function logout_evnt() {
  await logout(pb);
  userData.clear();
}
</script>

<button
  type="button"
  class={`${baseClasses} ${borderClasses} ${bgColorClasses} ${disableClasses} ${ringClasses}`}
  on:click={logout_evnt}
>
  {@html logoutSVG}
  {title}
</button>

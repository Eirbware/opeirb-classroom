import Pocketbase from 'pocketbase';

export const pb = new Pocketbase(import.meta.env.PUBLIC_POCKETBASE_URL)

export async function authenticate(pb: Pocketbase) {
  const authData = await pb.collection("users").authWithOAuth2({ provider: "oidc" })
  return authData;
}

export async function logout(pb: Pocketbase) {
  pb.authStore.clear();
}

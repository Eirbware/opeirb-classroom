export type UserData = {
  name: string;
};

let userData = $state<UserData | null>(null);

export function useUserData() {
  return {
    get data() {
      return userData;
    },
    update: (newUserData: UserData) => userData = newUserData,
    clear: () => userData = null
  };
}

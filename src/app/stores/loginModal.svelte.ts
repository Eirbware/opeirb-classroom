let loginModal = $state(false);

export function useLoginModal() {
  return {
    get open() {
      return loginModal;
    },
    show: () => loginModal = true,
    hide: () => loginModal = false
  };
}

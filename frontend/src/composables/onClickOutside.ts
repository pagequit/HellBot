export function onClickOutside(
  element: HTMLElement,
  handler: (event: MouseEvent) => void,
): { destroy: () => void } {
  function listener(event: MouseEvent) {
    if (!element.contains(event.target as Node)) {
      handler(event);
    }
  }

  document.addEventListener("click", listener, true);

  return {
    destroy() {
      document.removeEventListener("click", listener, true);
    },
  };
}

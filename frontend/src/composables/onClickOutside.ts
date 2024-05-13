export function onClickOutside(
  elements: Array<HTMLElement>,
  handler: (event: MouseEvent) => void,
): { destroy: () => void } {
  function listener(event: MouseEvent) {
    if (
      elements.reduce(
        (isOutside, element) =>
          isOutside && !element.contains(event.target as Node),
        true,
      )
    ) {
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

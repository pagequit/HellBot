export function onClickOutside(
  elements: Array<HTMLElement>,
  handler: (event: MouseEvent) => void,
): { destroy: () => void } {
  function listener(event: MouseEvent): void {
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
    destroy(): void {
      document.removeEventListener("click", listener, true);
    },
  };
}

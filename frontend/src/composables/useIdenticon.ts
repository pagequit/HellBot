/**
 * Transcribed by:
 * https://github.com/laurentpayot/minidenticons/
 */
function createIdenticon(hash: number): string {
  return `${[...Array(25)].reduce((acc, _, idx) => {
    return hash & (1 << idx % 15)
      ? `${acc}<circle cx="${idx > 14 ? 7 - ~~(idx / 5) : ~~(idx / 5)}" cy="${idx % 5}" r="0.5"/>`
      : acc;
  }, "<svg xmlns='http://www.w3.org/2000/svg' viewBox='-2 -2 8 8' fill='currentColor'>")}</svg>`;
}

function easyHash(key: string): number {
  return key.split("").reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0);
}

function generate(text: string) {
  return createIdenticon(easyHash(text));
}

export function useIdenticon() {
  return {
    generate,
  };
}

export function* createColorClassGenerator(): Generator<string, void, unknown> {
  let i = 0;
  const colorClasses = [
    "c-blurple",
    "c-fuchsia",
    "c-green",
    "c-red",
    "c-yellow",
    "c-gray",
  ];
  while (true) {
    yield colorClasses[i];
    i = (i + 1) % colorClasses.length;
  }
}

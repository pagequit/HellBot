export function canUseLocalStorage(): boolean {
  return "localStorage" in window && navigator.cookieEnabled;
}

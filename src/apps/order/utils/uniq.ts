export function uniq<T>(u: T[]) {
  return [...new Set(u)];
}

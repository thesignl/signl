/**
 * Minimal class-name joiner. Avoids pulling in a dependency for one
 * helper. Filters out falsy values so conditional classes stay clean.
 */
export function cn(
  ...parts: Array<string | false | null | undefined | 0>
): string {
  return parts.filter(Boolean).join(' ')
}

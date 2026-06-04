// Canonical identity for a media object (film, tv, book, album).
//
// Slugs are not a reliable identity key: the same work has been stored under
// several different slugs across the pipeline (e.g. "blade-runner" vs
// "blade-runner-1982", "eternal-sunshine-2004" vs
// "eternal-sunshine-of-the-spotless-mind-2004"). Deduping on slug alone lets
// the same media object appear twice. Identity is therefore derived from the
// normalized title plus the release year, which is stable across stores and
// across the title-spelling variations a re-analysis might produce.

export type Identifiable = {
  slug: string;
  title: string;
  year: number;
};

/** Lowercase, strip accents and every non-alphanumeric character. */
export function normalizeTitle(title: string): string {
  // NFKD splits accented letters into base + combining mark; the final
  // alphanumeric filter then drops the marks, so "Caché" -> "cache".
  return (title ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Stable identity key for a media object: normalized title + release year. */
export function mediaKey(title: string, year: number | undefined | null): string {
  return `${normalizeTitle(title)}::${year ?? ""}`;
}

/** Every key under which an item should be considered "already seen". */
function identityKeys(item: Identifiable): string[] {
  return [`slug:${item.slug}`, mediaKey(item.title, item.year)];
}

/**
 * Find the index of an existing record that refers to the same media object as
 * `candidate`, matching on either slug or canonical identity. Returns -1 if no
 * existing record matches.
 */
export function findDuplicateIndex<T extends Identifiable>(
  existing: T[],
  candidate: Identifiable,
): number {
  const keys = new Set(identityKeys(candidate));
  return existing.findIndex((item) => identityKeys(item).some((k) => keys.has(k)));
}

/**
 * Return a copy of `items` with duplicate media objects removed, keeping the
 * first occurrence of each. Order is preserved, so callers control priority by
 * concatenation order (e.g. curated before generated).
 */
export function dedupeByIdentity<T extends Identifiable>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (!item || !item.slug) continue;
    const keys = identityKeys(item);
    if (keys.some((k) => seen.has(k))) continue;
    for (const k of keys) seen.add(k);
    out.push(item);
  }
  return out;
}

/**
 * Merge `extra` into `base`, dropping any extra item that duplicates a media
 * object already present in `base` (by slug or canonical identity). `base` is
 * assumed to already be deduped and takes priority.
 */
export function mergeByIdentity<T extends Identifiable>(base: T[], extra: T[]): T[] {
  const seen = new Set<string>();
  for (const item of base) {
    for (const k of identityKeys(item)) seen.add(k);
  }
  const out = [...base];
  for (const item of extra) {
    if (!item || !item.slug) continue;
    const keys = identityKeys(item);
    if (keys.some((k) => seen.has(k))) continue;
    for (const k of keys) seen.add(k);
    out.push(item);
  }
  return out;
}

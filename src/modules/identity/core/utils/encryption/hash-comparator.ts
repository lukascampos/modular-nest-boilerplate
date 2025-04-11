export const HASH_COMPARATOR = Symbol('HASH_COMPARATOR');

export interface HashComparator {
  compare(plain: string, hash: string): Promise<boolean>;
}

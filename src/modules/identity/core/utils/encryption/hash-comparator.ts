export interface HashComparator {
  compare(plain: string, hash: string): Promise<boolean>;
}

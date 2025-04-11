export const HASH_GENERATOR = Symbol('HASH_GENERATOR');

export interface HashGenerator {
  hash(plain: string): Promise<string>;
}

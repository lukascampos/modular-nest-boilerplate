import { hash, compare } from 'bcryptjs';
import { HashComparator } from '@/modules/identity/core/utils/encryption/hash-comparator';
import { HashGenerator } from '@/modules/identity/core/utils/encryption/hash-generator';

export class BcryptHasher implements HashGenerator, HashComparator {
  private HASH_SALT_LENGTH = 10;

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  async compare(plain: string, hashedValue: string): Promise<boolean> {
    return compare(plain, hashedValue);
  }
}

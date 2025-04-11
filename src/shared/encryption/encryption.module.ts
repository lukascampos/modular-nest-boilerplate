import { Module } from '@nestjs/common';
import { HASH_COMPARATOR } from '@/modules/identity/core/utils/encryption/hash-comparator';
import { BcryptHasher } from './bcrypt-hasher';
import { HASH_GENERATOR } from '@/modules/identity/core/utils/encryption/hash-generator';

@Module({
  providers: [
    { provide: HASH_COMPARATOR, useClass: BcryptHasher },
    { provide: HASH_GENERATOR, useClass: BcryptHasher },
  ],
  exports: [HASH_COMPARATOR, HASH_GENERATOR],
})
export class EncryptionModule {}

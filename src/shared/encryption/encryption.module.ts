import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { HashComparator } from '@/modules/identity/core/utils/encryption/hash-comparator';
import { HashGenerator } from '@/modules/identity/core/utils/encryption/hash-generator';

@Module({
  providers: [
    { provide: HashComparator, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [HashComparator, HashGenerator],
})
export class EncryptionModule {}

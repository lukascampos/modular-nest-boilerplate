import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { HashComparator } from '@/modules/identity/core/utils/encryption/hash-comparator';
import { HashGenerator } from '@/modules/identity/core/utils/encryption/hash-generator';
import { JwtEncrypter } from '@/modules/identity/core/utils/encryption/jwt-encrypter';
import { JwtGenerator } from './jwt-generator';

@Module({
  providers: [
    { provide: HashComparator, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: JwtEncrypter, useClass: JwtGenerator },
  ],
  exports: [HashComparator, HashGenerator, JwtEncrypter],
})
export class EncryptionModule {}

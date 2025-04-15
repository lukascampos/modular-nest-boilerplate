import { Module } from '@nestjs/common';
import { CreateUsersController } from './controllers/create-user.controller';
import { CreateUserUseCase } from '../core/use-cases/create-user.use-case';
import { EncryptionModule } from '@/shared/encryption/encryption.module';
import { IdentityPersistenceModule } from '../persistence/identity-persistence.module';

@Module({
  imports: [IdentityPersistenceModule, EncryptionModule],
  controllers: [CreateUsersController],
  providers: [CreateUserUseCase],
})
export class HttpModule {}

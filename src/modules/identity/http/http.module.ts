import { Module } from '@nestjs/common';
import { CreateUsersController } from './controllers/create-user.controller';
import { CreateUserUseCase } from '../core/use-cases/create-user.use-case';
import { EncryptionModule } from '@/shared/encryption/encryption.module';
import { IdentityPersistenceModule } from '../persistence/identity-persistence.module';
import { AuthenticateUseCase } from '../core/use-cases/authenticate.use-case';
import { AuthenticateController } from './controllers/authenticate.controller';

@Module({
  imports: [IdentityPersistenceModule, EncryptionModule],
  controllers: [CreateUsersController, AuthenticateController],
  providers: [CreateUserUseCase, AuthenticateUseCase],
})
export class HttpModule {}

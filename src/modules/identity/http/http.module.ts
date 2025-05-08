import { Module } from '@nestjs/common';
import { CreateUsersController } from './controllers/create-user.controller';
import { CreateUserUseCase } from '../core/use-cases/create-user.use-case';
import { EncryptionModule } from '@/shared/encryption/encryption.module';
import { IdentityPersistenceModule } from '../persistence/identity-persistence.module';
import { AuthenticateUseCase } from '../core/use-cases/authenticate.use-case';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ListUsersController } from './controllers/list-users.controller';
import { ListUsersUseCase } from '../core/use-cases/list-users.use-case';
import { UpdateAccountController } from './controllers/update-account.controller';
import { UpdateAccountUseCase } from '../core/use-cases/update-account.use-case';

@Module({
  imports: [IdentityPersistenceModule, EncryptionModule],
  controllers: [
    CreateUsersController,
    AuthenticateController,
    ListUsersController,
    UpdateAccountController,
  ],
  providers: [
    CreateUserUseCase,
    AuthenticateUseCase,
    ListUsersUseCase,
    UpdateAccountUseCase,
  ],
})
export class HttpModule {}

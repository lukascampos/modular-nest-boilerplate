import { Module } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';
import { PrismaUsersRepository } from '@/modules/identity/persistence/prisma/repositories/prisma-users.repository';
import { PrismaAccountDeletionRequestsRepository } from '@/modules/identity/persistence/prisma/repositories/prisma-account-deletion-requests.repository';
import { AccountDeletionRequest } from '../core/entities/account-deletion-request.entity';
import { UsersRepository } from '../core/repositories/users.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: AccountDeletionRequest,
      useClass: PrismaAccountDeletionRequestsRepository,
    },
  ],
  exports: [
    UsersRepository,
    AccountDeletionRequest,
  ],
})
export class IdentityPersistenceModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from '@/shared/database/prisma.service';
import { USERS_REPOSITORY } from '../core/repositories/users.repository';
import { PrismaUsersRepository } from '@/modules/identity/persistence/prisma/repositories/prisma-users.repository';
import { ACCOUNT_DELETION_REQUESTS_REPOSITORY } from '../core/repositories/account-deletion-requests.repository';
import { PrismaAccountDeletionRequestsRepository } from '@/modules/identity/persistence/prisma/repositories/prisma-account-deletion-requests.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: USERS_REPOSITORY,
      useClass: PrismaUsersRepository,
    },
    {
      provide: ACCOUNT_DELETION_REQUESTS_REPOSITORY,
      useClass: PrismaAccountDeletionRequestsRepository,
    },
  ],
  exports: [
    USERS_REPOSITORY,
    ACCOUNT_DELETION_REQUESTS_REPOSITORY,
  ],
})
export class IdentityPersistenceModule {}

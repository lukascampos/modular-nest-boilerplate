import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users.repository';
import { USERS_REPOSITORY } from '@/modules/identity/core/repositories/users.repository';
import { ACCOUNT_DELETION_REQUESTS_REPOSITORY } from '@/modules/identity/core/repositories/account-deletion-requests.repository';
import { PrismaAccountDeletionRequestsRepository } from './prisma/repositories/prisma-account-deletion-requests.repository';

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
export class DatabaseModule {}

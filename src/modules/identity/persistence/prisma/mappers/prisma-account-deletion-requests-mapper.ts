import { AccountDeletionRequest as PrismaAccountDeletionRequest, Prisma } from '@prisma/client';
import { AccountDeletionRequest } from '@/modules/identity/core/entities/account-deletion-request.entity';

export class PrismaAccountDeletionRequestMapper {
  static toDomain(raw: PrismaAccountDeletionRequest): AccountDeletionRequest {
    return AccountDeletionRequest.create(
      {
        userId: raw.id,
        reason: raw.reason,
      },
      raw.id,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPrisma(
    accountDeletionRequest: AccountDeletionRequest,
  ): Prisma.AccountDeletionRequestUncheckedCreateInput {
    return {
      id: accountDeletionRequest.id,
      userId: accountDeletionRequest.userId,
      reason: accountDeletionRequest.reason,
    };
  }
}

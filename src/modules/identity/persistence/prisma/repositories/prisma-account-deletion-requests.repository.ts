import { Injectable } from '@nestjs/common';
import { AccountDeletionRequest } from '@/modules/identity/core/entities/account-deletion-request.entity';
import { AccountDeletionRequestsRepository } from '@/modules/identity/core/repositories/account-deletion-requests.repository';
import { PrismaAccountDeletionRequestMapper } from '../mappers/prisma-account-deletion-requests-mapper';
import { PrismaService } from '@/shared/database/prisma.service';

@Injectable()
export class PrismaAccountDeletionRequestsRepository implements AccountDeletionRequestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRequestById(id: string): Promise<AccountDeletionRequest | null> {
    const request = await this.prisma.accountDeletionRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return null;
    }

    return PrismaAccountDeletionRequestMapper.toDomain(request);
  }

  async findPendingByUserId(userId: string): Promise<AccountDeletionRequest | null> {
    const request = await this.prisma.accountDeletionRequest.findFirst({
      where: {
        userId,
        AND: {
          status: 'PENDING',
        },
      },
    });

    if (!request) {
      return null;
    }

    return PrismaAccountDeletionRequestMapper.toDomain(request);
  }

  async save(request: AccountDeletionRequest): Promise<void> {
    await this.prisma.accountDeletionRequest.upsert({
      where: { id: request.id },
      update: {
        id: request.id,
        userId: request.userId,
        reason: request.reason,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
      create: {
        id: request.id,
        userId: request.userId,
        reason: request.reason,
        createdAt: request.createdAt,
      },
    });
  }
}

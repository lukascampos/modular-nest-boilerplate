import { Either, left, right } from '@/modules/_shared/utils/either';
import { AccountDeletionRequestsRepository } from '../repositories/account-deletion-requests.repository';
import { UsersRepository } from '../repositories/users.repository';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { UserRole } from '../entities/user.entity';
import { NotAllowedError } from '../errors/not-allowed.error';
import { PendingAccountDeletionRequestNotFoundError } from '../errors/pending-account-deletion-request-not-found.error';

export interface ProcessAccountDeletionRequestInput {
  requestId: string;
  adminId: string;
}

type Output = Either<Error, void>;

export class ProcessAccountDeletionRequestUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly accountDeletionRequestsRepository: AccountDeletionRequestsRepository,
  ) {}

  async execute({ requestId, adminId }: ProcessAccountDeletionRequestInput): Promise<Output> {
    const adminUser = await this.usersRepository.findById(adminId);

    if (!adminUser) {
      return left(new UserNotFoundError(adminId));
    }

    if (adminUser.role !== UserRole.ADMIN) {
      return left(new NotAllowedError());
    }

    const request = await this
      .accountDeletionRequestsRepository
      .findRequestById(requestId);

    if (!request) {
      return left(new PendingAccountDeletionRequestNotFoundError(requestId));
    }

    const userWhoRequested = await this.usersRepository.findById(request.userId);

    if (!userWhoRequested) {
      return left(new UserNotFoundError(request.userId));
    }

    userWhoRequested.deactivate();
    await this.usersRepository.save(userWhoRequested);

    request.processRequest();
    await this.accountDeletionRequestsRepository.save(request);

    return right(undefined);
  }
}

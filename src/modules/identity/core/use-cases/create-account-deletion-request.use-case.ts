import { AccountDeletionRequest } from '../entities/account-deletion-request.entity';
import { Either, left, right } from '@/modules/_shared/utils/either';
import { AccountDeletionRequestsRepository } from '../repositories/account-deletion-requests.repository';
import { PendingAccountDeletionRequestExistsError } from '../errors/pending-account-deletion-request-exists.error';
import { UsersRepository } from '../repositories/users.repository';
import { UserNotFoundError } from '../errors/user-not-found.error';

export interface CreateAccountDeletionRequestInput {
  userId: string;
  reason: string;
}

type Output = Either<Error, AccountDeletionRequest>;

export class CreateAccountDeletionRequestUseCase {
  constructor(
    private readonly accountDeletionRequestsRepository: AccountDeletionRequestsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ userId, reason }: CreateAccountDeletionRequestInput): Promise<Output> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError(userId));
    }

    const existingRequest = await this
      .accountDeletionRequestsRepository
      .findPendingByUserId(userId);

    if (existingRequest) {
      return left(new PendingAccountDeletionRequestExistsError());
    }

    const request = AccountDeletionRequest.create({
      userId,
      reason,
    });

    await this.accountDeletionRequestsRepository.save(request);

    return right(request);
  }
}

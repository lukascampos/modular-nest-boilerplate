import { AccountDeletionRequest } from '../entities/account-deletion-request.entity';

export abstract class AccountDeletionRequestsRepository {
  abstract findPendingByUserId(userId: string): Promise<AccountDeletionRequest | null>;

  abstract findRequestById(requestId: string): Promise<AccountDeletionRequest | null>;

  abstract save(request: AccountDeletionRequest): Promise<void>;
}

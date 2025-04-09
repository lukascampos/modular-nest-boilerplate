import { AccountDeletionRequest } from '../entities/account-deletion-request.entity';

export interface AccountDeletionRequestsRepository {
  findPendingByUserId(userId: string): Promise<AccountDeletionRequest | null>;
  findRequestById(requestId: string): Promise<AccountDeletionRequest | null>;
  save(request: AccountDeletionRequest): Promise<void>;
}

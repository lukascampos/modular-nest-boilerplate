import { AccountDeletionRequest } from '../entities/account-deletion-request.entity';

export const ACCOUNT_DELETION_REQUESTS_REPOSITORY = Symbol('ACCOUNT_DELETION_REQUESTS_REPOSITORY');

export interface AccountDeletionRequestsRepository {
  findPendingByUserId(userId: string): Promise<AccountDeletionRequest | null>;
  findRequestById(requestId: string): Promise<AccountDeletionRequest | null>;
  save(request: AccountDeletionRequest): Promise<void>;
}

import { AccountDeletionRequest, RequestStatus } from '../../entities/account-deletion-request.entity';
import { AccountDeletionRequestsRepository } from '../account-deletion-requests.repository';

export class InMemoryAccountDeletionRequestsRepository
implements AccountDeletionRequestsRepository {
  public items: AccountDeletionRequest[] = [];

  async findPendingByUserId(userId: string): Promise<AccountDeletionRequest | null> {
    const request = this.items.find(
      (item) => item.userId === userId
      && item.status === RequestStatus.PENDING,
    );

    if (!request) {
      return null;
    }

    return request;
  }

  async save(request: AccountDeletionRequest): Promise<void> {
    this.items.push(request);
  }
}

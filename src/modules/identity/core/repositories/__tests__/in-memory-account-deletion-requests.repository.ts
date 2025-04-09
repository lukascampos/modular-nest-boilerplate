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
    const index = this.items.findIndex((item) => item.id === request.id);

    if (index >= 0) {
      this.items[index] = request;
    } else {
      this.items.push(request);
    }
  }

  async findRequestById(requestId: string): Promise<AccountDeletionRequest | null> {
    const request = this.items.find((item) => item.id === requestId);

    if (!request) {
      return null;
    }

    return request;
  }
}

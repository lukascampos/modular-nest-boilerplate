export class PendingAccountDeletionRequestNotFoundError extends Error {
  constructor(requestId: string) {
    super(`Pending account deletion request with id ${requestId} not found.`);
    this.name = 'PendingAccountDeletionRequestNotFoundError';
  }
}

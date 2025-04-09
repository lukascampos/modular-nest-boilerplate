export class PendingAccountDeletionRequestExistsError extends Error {
  constructor() {
    super('There is already a pending account deletion request.');
  }
}

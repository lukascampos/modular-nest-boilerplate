import { AccountDeletionRequest, RequestStatus } from '../account-deletion-request.entity';

describe('AccountDeletionRequest', () => {
  const baseProps = {
    userId: 'user-123',
    reason: 'I want to delete my account',
  };

  it('should create a request with PENDING status by default', () => {
    const request = AccountDeletionRequest.create(baseProps);

    expect(request.userId).toBe(baseProps.userId);
    expect(request.reason).toBe(baseProps.reason);
    expect(request.status).toBe(RequestStatus.PENDING);
    expect(request.createdAt).toBeInstanceOf(Date);
    expect(request.updatedAt).toBeInstanceOf(Date);
  });

  it('should update the reason', () => {
    const request = AccountDeletionRequest.create(baseProps);

    request.reason = 'Changed my mind';

    expect(request.reason).toBe('Changed my mind');
  });

  it('should change status to PROCESSED', () => {
    const request = AccountDeletionRequest.create(baseProps);

    request.processRequest();

    expect(request.status).toBe(RequestStatus.PROCESSED);
  });

  it('should change status to CANCELED', () => {
    const request = AccountDeletionRequest.create(baseProps);

    request.cancelRequest();

    expect(request.status).toBe(RequestStatus.CANCELED);
  });
});

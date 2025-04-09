import { AccountDeletionRequest, RequestStatus } from '../../entities/account-deletion-request.entity';
import { User, UserRole } from '../../entities/user.entity';
import { PendingAccountDeletionRequestExistsError } from '../../errors/pending-account-deletion-request-exists.error';
import { UserNotFoundError } from '../../errors/user-not-found.error';
import { InMemoryAccountDeletionRequestsRepository } from '../../repositories/__tests__/in-memory-account-deletion-requests.repository';
import { InMemoryUsersRepository } from '../../repositories/__tests__/in-memory-users.repository';
import { CreateAccountDeletionRequestUseCase } from '../create-account-deletion-request.use-case';

let createRequestUseCase: CreateAccountDeletionRequestUseCase;
let inMemoryAccountDeletionRequestsRepository: InMemoryAccountDeletionRequestsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('CreateAccountDeletionRequestUseCase', () => {
  beforeEach(() => {
    inMemoryAccountDeletionRequestsRepository = new InMemoryAccountDeletionRequestsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createRequestUseCase = new CreateAccountDeletionRequestUseCase(
      inMemoryAccountDeletionRequestsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should create a new deletion request if no pending request exists', async () => {
    inMemoryUsersRepository.save(User.create(
      {
        name: 'John Dow',
        email: 'john@example.com',
        password: '123456',
        role: UserRole.USER,
      },
      'user-123',
    ));

    const result = await createRequestUseCase.execute({
      userId: 'user-123',
      reason: 'I want to leave',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const request = result.value;
      expect(request.userId).toBe('user-123');
      expect(request.reason).toBe('I want to leave');
      expect(request.status).toBe(RequestStatus.PENDING);
    }
  });

  it('should return error if there is already a pending request', async () => {
    inMemoryUsersRepository.save(User.create(
      {
        name: 'John Dow',
        email: 'john@example.com',
        password: '123456',
        role: UserRole.USER,
      },
      'user-123',
    ));

    inMemoryAccountDeletionRequestsRepository.save(AccountDeletionRequest.create({
      userId: 'user-123',
      reason: 'I want to leave',
    }));

    const result = await createRequestUseCase.execute({
      userId: 'user-123',
      reason: 'I want to leave again',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(PendingAccountDeletionRequestExistsError);
    }
  });

  it('should return error the user does not exists', async () => {
    const result = await createRequestUseCase.execute({
      userId: 'user-123',
      reason: 'I want to leave',
    });

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(UserNotFoundError);
    }
  });
});

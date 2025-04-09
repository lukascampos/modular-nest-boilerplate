import { left, right } from '@/modules/_shared/utils/either';
import { AccountDeletionRequest } from '../../entities/account-deletion-request.entity';
import { User, UserRole } from '../../entities/user.entity';
import { NotAllowedError } from '../../errors/not-allowed.error';
import { PendingAccountDeletionRequestNotFoundError } from '../../errors/pending-account-deletion-request-not-found.error';
import { UserNotFoundError } from '../../errors/user-not-found.error';
import { InMemoryAccountDeletionRequestsRepository } from '../../repositories/__tests__/in-memory-account-deletion-requests.repository';
import { InMemoryUsersRepository } from '../../repositories/__tests__/in-memory-users.repository';
import { ProcessAccountDeletionRequestUseCase } from '../process-account-deletion-request.use-case';

describe('ProcessAccountDeletionRequestUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let deletionRequestsRepository: InMemoryAccountDeletionRequestsRepository;
  let sut: ProcessAccountDeletionRequestUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    deletionRequestsRepository = new InMemoryAccountDeletionRequestsRepository();
    sut = new ProcessAccountDeletionRequestUseCase(usersRepository, deletionRequestsRepository);
  });

  it('should deactivate the user and process the request if all is valid', async () => {
    const admin = User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456',
      role: UserRole.ADMIN,
    });

    const user = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    const request = AccountDeletionRequest.create({
      userId: user.id,
      reason: 'Privacy concerns',
    });

    await usersRepository.save(admin);
    await usersRepository.save(user);
    await deletionRequestsRepository.save(request);

    const result = await sut.execute({
      adminId: admin.id,
      requestId: request.id,
    });

    expect(result).toEqual(right(undefined));

    const updatedUser = await usersRepository.findById(user.id);
    const updatedRequest = await deletionRequestsRepository.findRequestById(request.id);

    expect(updatedUser?.isActive).toBe(false);
    expect(updatedRequest?.status).toBe('PROCESSED');
  });

  it('should return UserNotFoundError if admin does not exist', async () => {
    const result = await sut.execute({
      adminId: 'non-existent-admin',
      requestId: 'any-id',
    });

    expect(result).toEqual(left(new UserNotFoundError('non-existent-admin')));
  });

  it('should return NotAllowedError if user is not admin', async () => {
    const nonAdmin = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    await usersRepository.save(nonAdmin);

    const result = await sut.execute({
      adminId: nonAdmin.id,
      requestId: 'any-id',
    });

    expect(result).toEqual(left(new NotAllowedError()));
  });

  it('should return PendingAccountDeletionRequestNotFoundError if request is not found', async () => {
    const admin = User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456',
      role: UserRole.ADMIN,
    });

    await usersRepository.save(admin);

    const result = await sut.execute({
      adminId: admin.id,
      requestId: 'non-existent-request',
    });

    expect(result).toEqual(left(new PendingAccountDeletionRequestNotFoundError('non-existent-request')));
  });

  it('should return UserNotFoundError if user who requested deletion does not exist', async () => {
    const admin = User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456',
      role: UserRole.ADMIN,
    });

    await usersRepository.save(admin);

    const request = AccountDeletionRequest.create({
      userId: 'ghost-user',
      reason: 'I want to leave',
    });

    await deletionRequestsRepository.save(request);

    const result = await sut.execute({
      adminId: admin.id,
      requestId: request.id,
    });

    expect(result).toEqual(left(new UserNotFoundError('ghost-user')));
  });
});

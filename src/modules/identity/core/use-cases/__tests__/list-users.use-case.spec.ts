import { User, UserRole } from '../../entities/user.entity';
import { NotAllowedError } from '../../errors/not-allowed.error';
import { UserNotFoundError } from '../../errors/user-not-found.error';
import { InMemoryUsersRepository } from '../../repositories/__tests__/in-memory-users.repository';
import { ListUsersUseCase } from '../list-users.use-case';

describe('ListUsersUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: ListUsersUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new ListUsersUseCase(usersRepository);
  });

  it('should return a list of users for admin', async () => {
    const admin = User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      role: UserRole.ADMIN,
    });

    const user1 = User.create({
      name: 'User One',
      email: 'one@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    const user2 = User.create({
      name: 'User Two',
      email: 'two@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    await usersRepository.save(admin);
    await usersRepository.save(user1);
    await usersRepository.save(user2);

    const result = await sut.execute({
      adminId: admin.id,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toHaveLength(3);
    expect(result.value[0]).toHaveProperty('id');
    expect(result.value[0]).toHaveProperty('email');
  });

  it('should filter users by role', async () => {
    const admin = User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456',
      role: UserRole.ADMIN,
    });

    const user = User.create({
      name: 'Normal User',
      email: 'user@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    const otherAdmin = User.create({
      name: 'Another Admin',
      email: 'admin2@example.com',
      password: '123456',
      role: UserRole.ADMIN,
    });

    await usersRepository.save(admin);
    await usersRepository.save(user);
    await usersRepository.save(otherAdmin);

    const result = await sut.execute({
      adminId: admin.id,
      role: UserRole.USER,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].role).toBe(UserRole.USER);
  });

  it('should filter users by name or email', async () => {
    const admin = User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456',
      role: UserRole.ADMIN,
    });

    const matchingUser = User.create({
      name: 'John',
      email: 'john@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    const nonMatchingUser = User.create({
      name: 'Other User',
      email: 'other@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    await usersRepository.save(admin);
    await usersRepository.save(matchingUser);
    await usersRepository.save(nonMatchingUser);

    const result = await sut.execute({
      adminId: admin.id,
      nameOrEmail: 'john',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toHaveLength(1);
    expect(result.value[0].email).toBe('john@example.com');
  });

  it('should return UserNotFoundError if admin user does not exist', async () => {
    const result = await sut.execute({
      adminId: 'non-existent-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should return NotAllowedError if user is not an admin', async () => {
    const user = User.create({
      name: 'Normal User',
      email: 'user@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    await usersRepository.save(user);

    const result = await sut.execute({
      adminId: user.id,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});

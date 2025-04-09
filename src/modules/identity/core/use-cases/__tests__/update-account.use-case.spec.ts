import { User, UserRole } from '../../entities/user.entity';
import { InvalidCredentialsError } from '../../errors/invalid-credentials.error';
import { PropertyCannotBeEmptyError } from '../../errors/property-cannot-be-empty.error';
import { UserNotFoundError } from '../../errors/user-not-found.error';
import { InMemoryUsersRepository } from '../../repositories/__tests__/in-memory-users.repository';
import { FakeHasher } from '../../utils/encryption/__tests__/fake-hasher';
import { UpdateAccountUseCase } from '../update-account.use-case';

describe('UpdateAccountUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: UpdateAccountUseCase;
  let hashGenerator: FakeHasher;
  let hashComparator: FakeHasher;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hashGenerator = new FakeHasher();
    hashComparator = new FakeHasher();
    sut = new UpdateAccountUseCase(usersRepository, hashComparator, hashGenerator);
  });

  it('should update the user name successfully', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id,
      name: 'Updated Name',
    });

    expect(result.isRight()).toBe(true);
    const updatedUser = await usersRepository.findById(user.id);
    expect(updatedUser?.name).toBe('Updated Name');
  });

  it('should update the user password successfully', async () => {
    const password = '123456';

    const hashedPassword = await hashGenerator.hash(password);

    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: hashedPassword,
      role: UserRole.USER,
    });

    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id,
      oldPassword: password,
      newPassword: 'newpassword123',
    });

    expect(result.isRight()).toBe(true);

    const updatedUser = await usersRepository.findById(user.id);
    const doesMatch = await hashComparator.compare('newpassword123', updatedUser!.password);
    expect(doesMatch).toBe(true);
  });

  it('should return error if user does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existent-id',
      name: 'Test',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should return error if name is only spaces', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id,
      name: '   ',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyCannotBeEmptyError);
  });

  it('should return error if newPassword is only spaces', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id,
      oldPassword: '123456',
      newPassword: '   ',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PropertyCannotBeEmptyError);
  });

  it('should return error if trying to update password without oldPassword', async () => {
    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      role: UserRole.USER,
    });

    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id,
      newPassword: 'newpass123',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should return error if old password is incorrect', async () => {
    const hashedPassword = await hashGenerator.hash('correct-password');

    const user = User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: hashedPassword,
      role: UserRole.USER,
    });

    await usersRepository.save(user);

    const result = await sut.execute({
      userId: user.id,
      oldPassword: 'wrong-password',
      newPassword: 'newpass123',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});

import { AuthenticateUseCase } from '../authenticate.use-case';
import { JwtGenerator } from '../../utils/encryption/jwt-generator';
import { User, UserRole } from '../../entities/user.entity';
import { InvalidCredentialsError } from '../../errors/invalid-credentials.error';
import { InMemoryUsersRepository } from '../../repositories/__tests__/in-memory-users.repository';
import { FakeHasher } from '../../utils/encryption/__tests__/fake-hasher';
import { FakeJwtGenerator } from '../../utils/encryption/__tests__/fake-jwt-generator';

let authenticateUseCase: AuthenticateUseCase;
let jwtGenerator: JwtGenerator;
let inMemoryRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

describe('AuthenticateUseCase', () => {
  const validUser = User.create({
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456-hashed',
    role: UserRole.USER,
  });

  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    jwtGenerator = new FakeJwtGenerator();

    authenticateUseCase = new AuthenticateUseCase(inMemoryRepository, fakeHasher, jwtGenerator);
  });

  it('should authenticate successfully and return access token and user info', async () => {
    inMemoryRepository.save(validUser);

    const result = await authenticateUseCase.execute({
      email: 'john@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toEqual({
        accessToken: JSON.stringify({ sub: validUser.id, role: 'USER' }),
        role: validUser.role,
        userId: validUser.id,
        name: validUser.name,
      });
    }
  });

  it('should return error if user is not found', async () => {
    const result = await authenticateUseCase.execute({
      email: 'notfound@example.com',
      password: 'irrelevant',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should return error if user is inactive', async () => {
    const inactiveUser = User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed-password',
      role: UserRole.USER,
      isActive: false,
    });

    inMemoryRepository.save(inactiveUser);

    const result = await authenticateUseCase.execute({
      email: 'john@example.com',
      password: 'any-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should return error if password does not match', async () => {
    inMemoryRepository.save(validUser);

    const result = await authenticateUseCase.execute({
      email: 'john@example.com',
      password: 'wrong-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidCredentialsError);
  });
});

import { Either, left, right } from '@/modules/_shared/utils/either';
import { UsersRepository } from '../repositories/users.repository';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { HashComparator } from '../utils/encryption/hash-comparator';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { HashGenerator } from '../utils/encryption/hash-generator';
import { PropertyCannotBeEmptyError } from '../errors/property-cannot-be-empty.error';

export interface UpdateAccountInput {
  userId: string;
  name?: string;
  oldPassword?: string;
  newPassword?: string;
}

type Output = Either<Error, void>;

export class UpdateAccountUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashComparator: HashComparator,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    name,
    newPassword,
    oldPassword,
  }: UpdateAccountInput): Promise<Output> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotFoundError(userId));
    }

    if (name) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return left(new PropertyCannotBeEmptyError('Name'));
      }

      user.name = trimmedName;
    }

    if (newPassword) {
      const trimmedNewPassword = newPassword.trim();
      if (!trimmedNewPassword) {
        return left(new PropertyCannotBeEmptyError('New password'));
      }

      if (!oldPassword) {
        return left(new InvalidCredentialsError());
      }

      const doesOldPasswordMatches = await this.hashComparator.compare(oldPassword, user.password);

      if (!doesOldPasswordMatches) {
        return left(new InvalidCredentialsError());
      }

      const hashedNewPassword = await this.hashGenerator.hash(newPassword);

      user.password = hashedNewPassword;
    }

    await this.usersRepository.save(user);

    return right(undefined);
  }
}

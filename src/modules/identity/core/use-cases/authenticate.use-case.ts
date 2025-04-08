import { Either, left, right } from '@/modules/_shared/utils/either';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { HashComparator } from '../utils/encryption/hash-comparator';
import { UsersRepository } from '../repositories/users.repository';
import { JwtGenerator } from '../utils/encryption/jwt-generator';

export interface AuthenticateInput {
  email: string;
  password: string;
}

interface AuthenticateOutput {
  accessToken: string;
  role: string;
  userId: string;
  name: string;
}

type Output = Either<InvalidCredentialsError, AuthenticateOutput>

export class AuthenticateUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashComparator: HashComparator,
    private readonly jwtGenerator: JwtGenerator,
  ) {}

  async execute({ email, password }: AuthenticateInput): Promise<Output> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidCredentialsError());
    }

    if (!user.isActive) {
      return left(new InvalidCredentialsError());
    }

    const doesPasswordMatches = await this.hashComparator.compare(password, user.password);

    if (!doesPasswordMatches) {
      return left(new InvalidCredentialsError());
    }

    const accessToken = await this.jwtGenerator.generate({ sub: user.id, role: user.role });

    return right({
      accessToken,
      role: user.role,
      userId: user.id,
      name: user.name,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/modules/_shared/utils/either';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { HashComparator } from '../utils/encryption/hash-comparator';
import { UsersRepository } from '../repositories/users.repository';
import { JwtEncrypter } from '../utils/encryption/jwt-encrypter';

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

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashComparator: HashComparator,
    private readonly jwtEncrypter: JwtEncrypter,
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

    const accessToken = await this.jwtEncrypter.encrypt({ sub: user.id, role: user.role });

    return right({
      accessToken,
      role: user.role,
      userId: user.id,
      name: user.name,
    });
  }
}

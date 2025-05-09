import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/modules/_shared/utils/either';
import { User, UserRole } from '../entities/user.entity';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';
import { UsersRepository } from '../repositories/users.repository';
import { HashGenerator } from '../utils/encryption/hash-generator';
import { UserFile } from '../entities/user-file.entity';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  fileId?: string
}

interface CreateUserOutput {
  id: string;
  name: string;
  email: string;
  avatar?: UserFile;
  role: string;
}

type Output = Either<UserAlreadyExistsError, { user: CreateUserOutput }>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name, email, password, fileId,
  }: CreateUserInput): Promise<Output> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      return left(new UserAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    if (fileId) {
      const avatar = UserFile.create({
        userId: user.id,
        fileId,
      });

      user.avatar = avatar;
    }

    await this.usersRepository.save(user);

    return right({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? undefined,
        role: user.role,
      },
    });
  }
}

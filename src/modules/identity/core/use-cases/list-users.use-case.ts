import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/modules/_shared/utils/either';
import { UserRole } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { NotAllowedError } from '../errors/not-allowed.error';
import { UserNotFoundError } from '../errors/user-not-found.error';

export interface ListUsersInput {
  adminId: string;
  page?: number;
  limit?: number;
  nameOrEmail?: string;
  role?: UserRole;
}

export interface ListUsersOutput {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

type Output = Either<Error, ListUsersOutput[]>

@Injectable()
export class ListUsersUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({
    adminId,
    limit,
    page,
    nameOrEmail,
    role,
  }: ListUsersInput): Promise<Output> {
    const adminUser = await this.usersRepository.findById(adminId);

    if (!adminUser) {
      return left(new UserNotFoundError(adminId));
    }

    if (adminUser.role !== UserRole.ADMIN) {
      return left(new NotAllowedError());
    }

    const users = await this.usersRepository.findMany({
      page,
      limit,
      nameOrEmail,
      role,
    });

    const profiles = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }));

    return right(profiles);
  }
}

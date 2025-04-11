import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { User } from '@/modules/identity/core/entities/user.entity';
import { FindManyUsersInput, UsersRepository } from '@/modules/identity/core/repositories/users.repository';
import { PrismaService } from '../prisma.service';
import { PrismaUsersMapper } from '../mappers/prisma-users-mapper';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUsersMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return PrismaUsersMapper.toDomain(user);
  }

  async findMany(filters: FindManyUsersInput): Promise<User[]> {
    const {
      page = 1, limit = 10, nameOrEmail, role,
    } = filters;

    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(nameOrEmail && {
        OR: [
          {
            name: {
              contains: nameOrEmail,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            email: {
              contains: nameOrEmail,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    const users = await this.prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return users.map(PrismaUsersMapper.toDomain);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  }
}

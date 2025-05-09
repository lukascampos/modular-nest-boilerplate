import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User, UserProps, UserRole } from '@/modules/identity/core/entities/user.entity';
import { PrismaService } from '@/shared/database/prisma.service';
import { PrismaUsersMapper } from '@/modules/identity/persistence/prisma/mappers/prisma-users-mapper';

export function makeUser(
  override: Partial<UserProps> = {},
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: UserRole.USER,
      ...override,
    },
    randomUUID(),
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUsersMapper.toPrisma(user),
    });

    return user;
  }
}

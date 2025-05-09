import { User as PrismaUser, Prisma } from '@prisma/client';
import { User, UserRole } from '@/modules/identity/core/entities/user.entity';

export class PrismaUsersMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        role: raw.role as UserRole,
      },
      raw.id,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    };
  }
}

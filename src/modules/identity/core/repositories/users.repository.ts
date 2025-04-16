import { User, UserRole } from '../entities/user.entity';

export interface FindManyUsersInput {
  page?: number;
  limit?: number;
  nameOrEmail?: string;
  role?: UserRole;
}

export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;

  abstract findById(id: string): Promise<User | null>;

  abstract findMany(filters: FindManyUsersInput): Promise<User[]>;

  abstract save(user: User): Promise<void>;
}

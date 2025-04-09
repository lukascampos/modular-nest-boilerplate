import { User, UserRole } from '../entities/user.entity';

export interface FindManyUsersInput {
  page?: number;
  limit?: number;
  nameOrEmail?: string;
  role?: UserRole;
}

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findMany(filters: FindManyUsersInput): Promise<User[]>;

  save(user: User): Promise<void>;
}

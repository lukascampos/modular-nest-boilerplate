import { User } from '../entities/user.entity';

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;

  save(user: User): Promise<void>;
}

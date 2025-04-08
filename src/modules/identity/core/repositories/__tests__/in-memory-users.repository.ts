import { User } from '../../entities/user.entity';
import { UsersRepository } from '../users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async save(user: User) {
    this.items.push(user);

    return user;
  }
}

import { User } from '../../entities/user.entity';
import { FindManyUsersInput, UsersRepository } from '../users.repository';

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
    const index = this.items.findIndex((item) => item.id === user.id);

    if (index >= 0) {
      this.items[index] = user;
    } else {
      this.items.push(user);
    }
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findMany(filters: FindManyUsersInput) {
    const {
      page = 1,
      limit = 10,
      nameOrEmail,
      role,
    } = filters;

    let result = this.items;

    if (nameOrEmail) {
      result = result.filter((user) => user.name.includes(nameOrEmail)
      || user.email.includes(nameOrEmail));
    }

    if (role) {
      result = result.filter((user) => user.role === role);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return result.slice(startIndex, endIndex);
  }
}

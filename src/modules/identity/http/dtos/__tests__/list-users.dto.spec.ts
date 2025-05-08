import { validate } from 'class-validator';
import { ListUsersDto } from '../list-users.dto';
import { UserRole } from '@/modules/identity/core/entities/user.entity';

let sut: ListUsersDto;

describe('ListUsersDto', () => {
  beforeEach(() => {
    sut = new ListUsersDto();
  });

  it('should validate when all fields are valid', async () => {
    sut.page = 1;
    sut.limit = 1;
    sut.nameOrEmail = 'John Doe';
    sut.role = UserRole.USER;

    const errors = await validate(sut);

    expect(errors.length).toBe(0);
  });

  it('should return error when page is not a number', async () => {
    sut.page = '1' as unknown as number;

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isNumber).toBe('page must be a number conforming to the specified constraints');
  });

  it('should return error when limit is not a number', async () => {
    sut.limit = '1' as unknown as number;

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isNumber).toBe('limit must be a number conforming to the specified constraints');
  });

  it('should return error when nameOrEmail is not a string', async () => {
    sut.nameOrEmail = 1 as unknown as string;

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isString).toBe('nameOrEmail must be a string');
  });
});

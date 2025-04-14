import { validate } from 'class-validator';
import { CreateUserDto } from '../create-user.dto';

let sut: CreateUserDto;

describe('CreateUserDto', () => {
  beforeEach(() => {
    sut = new CreateUserDto();
  });

  it('should validate when all fields are valid', async () => {
    sut.name = 'John Doe';
    sut.email = 'john@example.com';
    sut.password = 'Str0ngP@ssw0rd!';

    const errors = await validate(sut);

    expect(errors.length).toBe(0);
  });

  it('should return error when name is not a full name', async () => {
    sut.name = 'John';
    sut.email = 'john@example.com';
    sut.password = 'Str0ngP@ssw0rd!';

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.matches).toBe('name must be the full name');
  });

  it('should return error when email is invalid', async () => {
    sut.name = 'John Doe';
    sut.email = 'not-an-email';
    sut.password = 'Str0ngP@ssw0rd!';

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isEmail).toBe('email must be an email');
  });

  it('should return error when password is weak', async () => {
    sut.name = 'John Doe';
    sut.email = 'john@example.com';
    sut.password = '123456789';

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isStrongPassword).toBe('password is not strong enough');
  });
});

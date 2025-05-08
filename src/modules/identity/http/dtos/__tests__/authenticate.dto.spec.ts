import { validate } from 'class-validator';
import { AuthenticateDto } from '../authenticate.dto';

let sut: AuthenticateDto;

describe('AuthenticateDto', () => {
  beforeEach(() => {
    sut = new AuthenticateDto();
  });

  it('should validate when all fields are valid', async () => {
    sut.email = 'john@example.com';
    sut.password = 'Test@123';

    const errors = await validate(sut);

    expect(errors.length).toBe(0);
  });

  it('should return error when email is invalid', async () => {
    sut.email = 'not-an-email';
    sut.password = 'Test@123';

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isEmail).toBe('email must be an email');
  });
});

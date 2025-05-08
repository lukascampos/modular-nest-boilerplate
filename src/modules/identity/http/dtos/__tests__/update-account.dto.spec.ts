import { validate } from 'class-validator';
import { UpdateAccountDto } from '../update-account.dto';

let sut: UpdateAccountDto;

describe('UpdateAccountDto', () => {
  beforeEach(() => {
    sut = new UpdateAccountDto();
  });

  it('should validate when all fields are valid', async () => {
    sut.name = 'John Doe';
    sut.oldPassword = 'oldPassword';
    sut.newPassword = 'newPassword';

    const errors = await validate(sut);

    expect(errors.length).toBe(0);
  });

  it('should return error when name is not a string', async () => {
    sut.name = 7 as unknown as string;

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isString).toBe('name must be a string');
  });

  it('should return error when oldPassword is not a string', async () => {
    sut.oldPassword = 7 as unknown as string;

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isString).toBe('oldPassword must be a string');
  });

  it('should return error when newPassword is not a string', async () => {
    sut.newPassword = 7 as unknown as string;

    const errors = await validate(sut);

    expect(errors.length).toBe(1);
    expect(errors[0].constraints?.isString).toBe('newPassword must be a string');
  });
});

import {
  Controller, Body, BadRequestException, Patch,
} from '@nestjs/common';
import { UpdateAccountUseCase } from '../../core/use-cases/update-account.use-case';
import { UpdateAccountDto } from '../dtos/update-account.dto';
import { CurrentUser } from '@/modules/_shared/auth/decorators/current-user.decorator';
import { UserPayload } from '@/modules/_shared/auth/jwt/jwt.strategy';
import { PropertyCannotBeEmptyError } from '../../core/errors/property-cannot-be-empty.error';
import { InvalidCredentialsError } from '../../core/errors/invalid-credentials.error';

@Controller('users')
export class UpdateAccountController {
  constructor(private readonly updateAccount: UpdateAccountUseCase) {}

  @Patch()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: UpdateAccountDto,
  ) {
    const { name, oldPassword, newPassword } = body;

    if (!name && !oldPassword && !newPassword) {
      throw new BadRequestException('At least one field must be provided to update the account');
    }

    const result = await this.updateAccount.execute({
      userId: user.sub, name, oldPassword, newPassword,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case PropertyCannotBeEmptyError:
          throw new BadRequestException(error.message);
        case InvalidCredentialsError:
          throw new BadRequestException('Password does not match');
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}

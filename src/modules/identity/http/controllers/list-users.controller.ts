import {
  Controller, Body, BadRequestException, Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ListUsersUseCase } from '../../core/use-cases/list-users.use-case';
import { RolesGuard } from '@/modules/_shared/auth/roles/roles.guard';
import { Roles } from '@/modules/_shared/auth/decorators/roles.decorator';
import { ListUsersDto } from '../dtos/list-users.dto';
import { CurrentUser } from '@/modules/_shared/auth/decorators/current-user.decorator';
import { UserPayload } from '@/modules/_shared/auth/jwt/jwt.strategy';
import { UserRole } from '../../core/entities/user.entity';
import { NotAllowedError } from '../../core/errors/not-allowed.error';

@Controller('users')
@UseGuards(RolesGuard)
export class ListUsersController {
  constructor(private readonly listUsers: ListUsersUseCase) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async handle(
    @Body() body: ListUsersDto,
    @CurrentUser() adminUser: UserPayload,
  ) {
    const result = await this.listUsers.execute({
      adminId: adminUser.sub.toString(),
      ...body,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const users = result.value;

    return { users };
  }
}

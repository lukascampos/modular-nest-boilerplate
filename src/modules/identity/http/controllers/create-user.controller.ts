import {
  Controller, Post, Body, ConflictException, BadRequestException,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../core/use-cases/create-user.use-case';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserAlreadyExistsError } from '../../core/errors/user-already-exists.error';
import { Public } from '@/modules/_shared/auth/decorators/public.decorator';

@Controller('users')
export class CreateUsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @Public()
  async handle(@Body() body: CreateUserDto) {
    const { name, email, password } = body;

    const result = await this.createUserUseCase.execute({ name, email, password });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}

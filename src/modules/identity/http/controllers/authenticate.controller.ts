import {
  BadRequestException,
  Body, Controller, HttpCode, Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticateUseCase } from '../../core/use-cases/authenticate.use-case';
import { AuthenticateDto } from '../dtos/authenticate.dto';
import { Public } from '@/modules/_shared/auth/decorators/public.decorator';
import { InvalidCredentialsError } from '../../core/errors/invalid-credentials.error';

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUSeCase: AuthenticateUseCase) {}

  @Post()
  @Public()
  @HttpCode(200)
  async handle(@Body() body: AuthenticateDto) {
    const { email, password } = body;

    const result = await this.authenticateUSeCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}

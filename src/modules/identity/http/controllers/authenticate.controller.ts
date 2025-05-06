import {
  Body, Controller, Post,
} from '@nestjs/common';
import { AuthenticateUseCase } from '../../core/use-cases/authenticate.use-case';
import { AuthenticateDto } from '../dtos/authenticate.dto';
import { Public } from '@/modules/_shared/auth/decorators/public.decorator';

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUSeCase: AuthenticateUseCase) {}

  @Post()
  @Public()
  async handle(@Body() body: AuthenticateDto) {
    const { email, password } = body;

    const result = await this.authenticateUSeCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      throw new Error();
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}

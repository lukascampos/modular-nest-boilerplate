import {
  Body, Controller, Post,
} from '@nestjs/common';
import { AuthenticateUseCase } from '../../core/use-cases/authenticate.use-case';
import { AuthenticateDto } from '../dtos/authenticate.dto';

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateUSeCase: AuthenticateUseCase) {}

  @Post()
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

import {
  IsEmail, IsNotEmpty, IsString,
} from 'class-validator';
import { AuthenticateInput } from '../../core/use-cases/authenticate.use-case';

export class AuthenticateDto implements AuthenticateInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
    email: string;

  @IsNotEmpty()
  @IsString()
    password: string;
}

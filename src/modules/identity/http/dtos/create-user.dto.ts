import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { CreateUserInput } from '../../core/use-cases/create-user.use-case';

export class CreateUserDto implements CreateUserInput {
  @IsNotEmpty()
    name: string;

  @IsEmail()
    email: string;

  @MinLength(6)
    password: string;
}

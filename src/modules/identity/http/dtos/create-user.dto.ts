import {
  IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches, MinLength,
} from 'class-validator';
import { CreateUserInput } from '../../core/use-cases/create-user.use-case';

export class CreateUserDto implements CreateUserInput {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\S+\s+\S+$/, {
    message: 'name must be the full name',
  })
    name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
    email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  @MinLength(8)
    password: string;
}

import { IsOptional, IsString } from 'class-validator';
import { UpdateAccountInput } from '../../core/use-cases/update-account.use-case';

export class UpdateAccountDto implements Omit<UpdateAccountInput, 'userId'> {
  @IsOptional()
  @IsString()
    name?: string;

  @IsOptional()
  @IsString()
    oldPassword?: string;

  @IsOptional()
  @IsString()
    newPassword?: string;
}

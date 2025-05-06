import {
  IsNumber, IsOptional, IsString,
} from 'class-validator';
import { ListUsersInput } from '../../core/use-cases/list-users.use-case';
import { UserRole } from '../../core/entities/user.entity';

export class ListUsersDto implements Omit<ListUsersInput, 'adminId'> {
  @IsNumber()
  @IsOptional()
    page?: number | undefined;

  @IsNumber()
  @IsOptional()
    limit?: number | undefined;

  @IsString()
  @IsOptional()
    nameOrEmail?: string | undefined;

  @IsString()
  @IsOptional()
    role?: UserRole | undefined;
}

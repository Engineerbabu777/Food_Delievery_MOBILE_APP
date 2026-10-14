import { UserRole } from '@food-delivery/types';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { userRoleEnum } from '../../db/schema/user.schema';

export class RegisterDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(userRoleEnum)
  role!: UserRole;
}

import { IsArray, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {

  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  password: string;

  @IsArray()
  roles: string[];
}

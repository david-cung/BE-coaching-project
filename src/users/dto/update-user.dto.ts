import { IsEmail, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  userName: string;

  @IsOptional()
  @Length(8, 24)
  password: string;

  @IsOptional()
  @Length(8, 100000)
  photoURL: string;
}

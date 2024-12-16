import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  // @Validate(UniqueEmailValidator)
  email: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @Length(8, 24)
  password: string;

  @IsOptional()
  @Length(8, 100000)
  photoUrl: string;
}

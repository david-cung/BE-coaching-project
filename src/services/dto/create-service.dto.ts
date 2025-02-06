import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  id: string;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;

  @IsString()
  @IsOptional()
  updatedAt: Date;
}

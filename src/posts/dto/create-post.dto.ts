import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
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
  updatedAt: Date;
}

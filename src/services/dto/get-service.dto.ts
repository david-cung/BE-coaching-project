import { IsOptional } from 'class-validator';

export class GetServiceDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  offset: number;

  @IsOptional()
  category: string;
}

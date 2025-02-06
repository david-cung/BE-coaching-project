import { IsOptional } from 'class-validator';

export class GetServiceDto {
  @IsOptional()
  limit: number = 8;

  @IsOptional()
  offset: number = 8;
}

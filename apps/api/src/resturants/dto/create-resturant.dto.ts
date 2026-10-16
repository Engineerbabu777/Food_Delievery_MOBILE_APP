import { IsOptional, IsString } from 'class-validator';

export class CreateResturantDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsString()
  address!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  cuisineType!: string;
}

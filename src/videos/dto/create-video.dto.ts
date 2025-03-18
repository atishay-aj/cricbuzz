import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;
  @IsNumber()
  modified_time: number;
  @IsNumber()
  published_time: number;
  @IsString()
  thumbnail_id: string;
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

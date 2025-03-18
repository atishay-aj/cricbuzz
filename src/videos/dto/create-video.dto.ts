import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;
  @IsString()
  thumbnail_id: string;
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

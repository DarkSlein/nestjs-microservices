import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
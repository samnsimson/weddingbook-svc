import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @MinLength(3)
  username: string;

  @Field()
  @IsString()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @IsPhoneNumber('US')
  phone: string;

  @Field()
  @IsString()
  @IsStrongPassword()
  password: string;
}

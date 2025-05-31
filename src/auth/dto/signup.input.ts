import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, IsString, IsStrongPassword, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsString()
  @MinLength(3)
  username: string;

  @Field()
  @IsString()
  @MinLength(3)
  firstName: string;

  @Field()
  @IsString()
  @MinLength(3)
  lastName: string;

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

  @Field()
  @IsString()
  @IsStrongPassword()
  confirmPassword: string;
}

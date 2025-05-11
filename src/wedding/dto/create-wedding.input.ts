import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateWeddingInput {
  @IsString()
  @Field()
  title: string;

  @IsString()
  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @IsString()
  @Field()
  date: string;
}

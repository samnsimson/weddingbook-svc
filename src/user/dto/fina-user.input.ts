import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class FindUserInput {
  @IsString()
  @IsUUID()
  @Field()
  id: string;
}

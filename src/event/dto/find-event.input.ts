import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsUUID, ValidateIf } from 'class-validator';

@InputType()
export class FindEventInput {
  @Field({ nullable: true })
  @IsUUID()
  @ValidateIf((o) => !o.code)
  id?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @ValidateIf((o) => !o.id)
  code?: number;
}

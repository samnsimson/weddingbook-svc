import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @IsInt()
  @Min(1)
  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @IsInt()
  @Min(1)
  @Field(() => Int, { defaultValue: 1 })
  page: number;
}

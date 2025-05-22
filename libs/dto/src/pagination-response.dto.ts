import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginationResponse {
  @Field(() => Int)
  total: number;

  @Field(() => Int, { defaultValue: 10 })
  limit: number;

  @Field(() => Int, { defaultValue: 1 })
  page: number;
}

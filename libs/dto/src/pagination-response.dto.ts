import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginationResponse {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  page: number;
}

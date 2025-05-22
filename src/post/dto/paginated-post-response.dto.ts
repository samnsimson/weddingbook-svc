import { PaginationResponse } from '@app/dto';
import { Post } from '@app/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedPostResponse extends PaginationResponse {
  @Field(() => [Post])
  data: Array<Post>;
}

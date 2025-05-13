import { PaginationResponse } from '@app/dto';
import { Wedding } from '@app/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedWedding extends PaginationResponse {
  @Field(() => [Wedding])
  data: Array<Wedding>;
}

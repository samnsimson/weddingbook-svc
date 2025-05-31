import { PaginationResponse } from '@app/dto';
import { Event } from '@app/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedEvent extends PaginationResponse {
  @Field(() => [Event])
  data: Array<Event>;
}

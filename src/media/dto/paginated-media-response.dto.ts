import { PaginationResponse } from '@app/dto';
import { Media } from '@app/entities';
import { Field } from '@nestjs/graphql';

export class PaginatedMediaResponse extends PaginationResponse {
  @Field(() => [Media])
  data: Media[];
}

import { PaginationResponse } from '@app/dto';
import { Guest } from '@app/entities';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedGuest extends PaginationResponse {
  data: Array<Guest>;
}

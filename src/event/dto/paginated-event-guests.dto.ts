import { PaginationResponse } from '@app/dto';
import { User } from '@app/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginatedEventGuests extends PaginationResponse {
  @Field(() => [User], { defaultValue: [] })
  data: Array<User>;
}

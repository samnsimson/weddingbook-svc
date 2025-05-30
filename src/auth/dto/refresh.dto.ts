import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RefreshResponse {
  @Field()
  accessToken: string;

  @Field()
  tokenType: string;
}

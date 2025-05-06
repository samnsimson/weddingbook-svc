import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginEntity {
  @Field(() => Boolean)
  authenticated: boolean;

  @Field()
  tokenType: string;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

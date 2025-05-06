import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateWeddingInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

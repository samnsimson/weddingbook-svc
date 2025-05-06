import { CreateWeddingInput } from './create-wedding.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWeddingInput extends PartialType(CreateWeddingInput) {
  @Field(() => Int)
  id: number;
}

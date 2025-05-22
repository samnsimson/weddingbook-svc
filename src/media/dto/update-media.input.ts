import { CreateMediaInput } from './create-media.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMediaInput extends PartialType(CreateMediaInput) {
  @Field()
  id: string;
}

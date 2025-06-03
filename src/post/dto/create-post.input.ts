import { InputType, Field, OmitType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateMediaInput } from 'src/media/dto/create-media.input';

@InputType()
class MediaInput extends OmitType(CreateMediaInput, ['eventId', 'caption']) {}

@InputType()
export class CreatePostInput {
  @Field({ nullable: true, defaultValue: null })
  @IsString()
  @IsOptional()
  caption?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  eventId: string;

  @Field(() => MediaInput, { nullable: true })
  @IsNotEmpty()
  @IsOptional()
  media?: MediaInput;
}

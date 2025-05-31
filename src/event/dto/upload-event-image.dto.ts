import { ImageFor } from '@app/types';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

registerEnumType(ImageFor, { name: 'ImageFor' });

@InputType()
export class UploadEventImageInput {
  @Field()
  weddingId: string;

  @Field(() => ImageFor)
  for: ImageFor;

  @Field(() => GraphQLUpload)
  image: Promise<FileUpload>;
}

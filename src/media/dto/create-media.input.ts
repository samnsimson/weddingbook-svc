import { MediaType } from '@app/types';
import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';

@InputType()
export class CreateMediaInput {
  @Field(() => [GraphQLUpload], { description: 'Image or video file to upload' })
  file: Promise<Array<FileUpload>>;

  @Field({ nullable: true, description: 'Optional caption for the media' })
  caption?: string;

  @Field(() => MediaType, { description: 'PHOTO or VIDEO' })
  mediaType: MediaType;

  @Field({ description: 'Associated wedding ID' })
  weddingId: string;
}

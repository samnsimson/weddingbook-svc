import { MediaType } from '@app/types';
import { InputType, Field } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { IsArray, IsOptional, IsString, IsEnum, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateMediaInput {
  @Field(() => [GraphQLUpload], { description: 'Image or video file to upload' })
  @IsArray()
  @IsNotEmpty({ each: true })
  file: Array<Promise<FileUpload>>;

  @Field({ nullable: true, description: 'Optional caption for the media' })
  @IsOptional()
  @IsString()
  caption?: string;

  @Field(() => MediaType, { description: 'Type of media (image or video)' })
  @IsEnum(MediaType)
  mediaType: MediaType;

  @Field({ description: 'Associated wedding ID' })
  @IsString()
  @IsNotEmpty()
  weddingId: string;
}

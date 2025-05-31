import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { CreateEventInput } from './create-event.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @IsUUID()
  @Field()
  id: string;

  @IsString()
  @IsOptional()
  @Field()
  brideName?: string;

  @IsString()
  @IsOptional()
  @Field()
  groomName?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Field()
  brideImageUrl?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Field()
  groomImageUrl?: string;
}

import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { CreateWeddingInput } from './create-wedding.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWeddingInput extends PartialType(CreateWeddingInput) {
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

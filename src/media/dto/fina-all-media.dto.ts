import { PaginationInput } from '@app/dto';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class FindAllMediaInput extends PaginationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  eventId: string;
}

import { Guest } from '@app/entities';
import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateGuestInput extends PickType(Guest, ['role']) {
  @Field()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}

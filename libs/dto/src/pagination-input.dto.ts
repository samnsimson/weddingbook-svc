import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page: number;
}

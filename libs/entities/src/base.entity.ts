import { Field, ID, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  @Field({ nullable: true })
  deletedAt?: Date;
}

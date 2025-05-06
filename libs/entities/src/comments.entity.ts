import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from './base.entity';
import { User } from './user.entity';
import { Media } from './media.entity';

@Entity()
@ObjectType()
export class Comment extends EntityBase {
  @Column({ type: 'text' })
  @Field()
  content: string;

  @ManyToOne(() => User)
  @Field(() => User)
  author: User;

  @ManyToOne(() => Media, (media) => media.comments)
  @Field(() => Media)
  mediaItem: Media;
}

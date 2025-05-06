import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from './base.entity';
import { User } from './user.entity';
import { Media } from './media.entity';

@Entity()
@ObjectType()
export class MediaReaction extends EntityBase {
  @Column()
  @Field()
  reactionType: 'LIKE' | 'LOVE' | 'LAUGH';

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Media, (media) => media.reactions)
  @Field(() => Media)
  mediaItem: Media;
}

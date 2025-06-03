import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityBase } from './base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';
import { Media } from './media.entity';
import { Event } from './event.entity';

@Entity()
@ObjectType()
export class Post extends EntityBase {
  @Column({ type: 'text', default: null, nullable: true })
  @Field({ nullable: true, defaultValue: null })
  caption?: string;

  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.posts, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => [Media], { defaultValue: [] })
  @OneToMany(() => Media, (media) => media.post, { eager: true, cascade: true })
  media: Media[];
}

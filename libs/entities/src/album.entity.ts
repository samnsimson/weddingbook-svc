import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EntityBase } from './base.entity';
import { User } from './user.entity';
import { Media } from './media.entity';
import { Event } from './event.entity';

@Entity()
@ObjectType()
export class Album extends EntityBase {
  @Column()
  @Field()
  title: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description?: string;

  @ManyToOne(() => Event, (event) => event.albums)
  @Field(() => Event)
  event: Event;

  @ManyToOne(() => User)
  @Field(() => User)
  owner: User;

  @OneToMany(() => Media, (media) => media.album)
  @Field(() => [Media])
  mediaItems: Media[];
}

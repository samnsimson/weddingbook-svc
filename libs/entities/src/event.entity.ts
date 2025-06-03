import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { EntityBase } from './base.entity';
import { User } from './user.entity';
import { Guest } from './guest.entity';
import { Media } from './media.entity';
import { Album } from './album.entity';
import { Post } from './post.entity';

@Entity()
@ObjectType()
@Unique('UQ_EVENT_CODE', ['code'])
export class Event extends EntityBase {
  @Column({ type: 'int' })
  @Field(() => Int)
  code: number;

  @Column()
  @Field()
  title: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Field(() => Date)
  @Column({ type: 'timestamptz' })
  date: string;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true, defaultValue: null })
  venue: string;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true, defaultValue: null })
  address: string;

  @ManyToOne(() => User, (user) => user.events, { eager: true, nullable: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'owner_id' })
  @Field(() => User)
  owner: User;

  @OneToMany(() => Post, (post) => post.event, { eager: true })
  @Field(() => [Post], { defaultValue: [] })
  posts: Post[];

  @OneToMany(() => Guest, (guest) => guest.event, { eager: true })
  guests: Guest[];

  @OneToMany(() => Media, (media) => media.event)
  @Field(() => [Media], { defaultValue: [] })
  mediaItems: Media[];

  @OneToMany(() => Album, (album) => album.event)
  @Field(() => [Album], { defaultValue: [] })
  albums: Album[];
}

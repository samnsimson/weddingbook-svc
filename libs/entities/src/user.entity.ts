import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { EntityBase } from './base.entity';
import { Guest } from './guest.entity';
import { Post } from './post.entity';
import { Event } from './event.entity';

@Entity()
@ObjectType()
@Unique('UQ_USERNAME', ['username'])
@Unique('UQ_EMAIL', ['email'])
@Unique('UQ_PHONE', ['phone'])
export class User extends EntityBase {
  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  email: string;

  @Column({ name: 'first_name', default: null })
  @Field()
  firstName: string;

  @Column({ name: 'last_name', default: null })
  @Field()
  lastName: string;

  @Column()
  @Field()
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isEmailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isPhoneVerified: boolean;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isActive: boolean;

  @OneToMany(() => Guest, (guest) => guest.user)
  @Field(() => [Guest])
  guestConnections: Guest[];

  @OneToMany(() => Event, (event) => event.owner, { onDelete: 'SET NULL' })
  @Field(() => [Event], { nullable: true, defaultValue: [] })
  events: Event[];

  @OneToMany(() => Post, (post) => post.user)
  @Field(() => [Post], { nullable: true, defaultValue: [] })
  posts: Post[];
}

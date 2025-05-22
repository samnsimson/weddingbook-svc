import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityBase } from './base.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Wedding } from './wedding.entity';
import { User } from './user.entity';
import { Media } from './media.entity';

@Entity()
@ObjectType()
export class Post extends EntityBase {
  @Column({ type: 'text', default: null, nullable: true })
  @Field({ nullable: true, defaultValue: null })
  caption?: string;

  @Field(() => Wedding)
  @ManyToOne(() => Wedding, (wedding) => wedding.posts, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'wedding_id' })
  wedding: Wedding;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => [Media], { defaultValue: [] })
  @OneToMany(() => Media, (media) => media.post, { eager: true, cascade: true })
  media: Media[];
}

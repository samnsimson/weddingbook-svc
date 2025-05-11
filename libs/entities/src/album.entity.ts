import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EntityBase } from './base.entity';
import { Wedding } from './wedding.entity';
import { User } from './user.entity';
import { Media } from './media.entity';

@Entity()
@ObjectType()
export class Album extends EntityBase {
  @Column()
  @Field()
  title: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description?: string;

  @ManyToOne(() => Wedding, (wedding) => wedding.albums)
  @Field(() => Wedding)
  wedding: Wedding;

  @ManyToOne(() => User)
  @Field(() => User)
  owner: User;

  @OneToMany(() => Media, (media) => media.album)
  @Field(() => [Media])
  mediaItems: Media[];
}

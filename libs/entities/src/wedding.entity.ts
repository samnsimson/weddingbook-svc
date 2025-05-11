import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, Unique } from 'typeorm';
import { EntityBase } from './base.entity';
import { User } from './user.entity';
import { Guest } from './guest.entity';
import { Media } from './media.entity';
import { Album } from './album.entity';

@Entity()
@ObjectType()
@Unique('UQ_WEDDING_CODE', ['code'])
export class Wedding extends EntityBase {
  @Column({ type: 'int' })
  @Field(() => Int)
  code: number;

  @Column()
  @Field()
  title: string;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  description?: string;

  @Column({ type: 'timestamptz' })
  @Field()
  date: Date;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  brideName: string;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  groomName: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field({ nullable: true })
  brideImageUrl: string;

  @Column({ type: 'text', nullable: true, default: null })
  @Field({ nullable: true })
  groomImageUrl: string;

  @OneToOne(() => User, (user) => user.wedding, { eager: true })
  @JoinColumn()
  @Field(() => User)
  owner: User;

  @OneToMany(() => Guest, (guest) => guest.wedding)
  @Field(() => [Guest], { defaultValue: [] })
  guests: Guest[];

  @OneToMany(() => Media, (media) => media.wedding)
  @Field(() => [Media], { defaultValue: [] })
  mediaItems: Media[];

  @OneToMany(() => Album, (album) => album.wedding)
  @Field(() => [Album], { defaultValue: [] })
  albums: Album[];
}

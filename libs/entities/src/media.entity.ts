import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { EntityBase } from './base.entity';
import { User } from './user.entity';
import { Wedding } from './wedding.entity';
import { Album } from './album.entity';
import { MediaReaction } from './media-reactions.entity';
import { Comment } from './comments.entity';
import { Post } from './post.entity';
import { MediaType } from '@app/types';

registerEnumType(MediaType, { name: 'MediaType' });
@Entity()
@ObjectType()
export class Media extends EntityBase {
  @Column()
  @Field()
  url: string;

  @Column({ type: 'enum', enum: MediaType })
  @Field(() => MediaType)
  mediaType: MediaType;

  @Column({ type: 'text', nullable: true })
  @Field({ nullable: true })
  caption?: string;

  @ManyToOne(() => User, { eager: true })
  @Field(() => User)
  uploadedBy: User;

  @ManyToOne(() => Wedding, (wedding) => wedding.mediaItems)
  @Field(() => Wedding)
  wedding: Wedding;

  @ManyToOne(() => Post, (post) => post.media, { nullable: true })
  @Field(() => Post, { nullable: true })
  post?: Post;

  @ManyToOne(() => Album, (album) => album.mediaItems, { nullable: true })
  @Field(() => Album, { nullable: true })
  album?: Album;

  @OneToMany(() => MediaReaction, (reaction) => reaction.mediaItem)
  @Field(() => [MediaReaction])
  reactions: MediaReaction[];

  @OneToMany(() => Comment, (comment) => comment.mediaItem)
  @Field(() => [Comment])
  comments: Comment[];
}

import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EntityBase } from './base.entity';
import { User } from './user.entity';
import { Wedding } from './wedding.entity';

@Entity()
@ObjectType()
export class Guest extends EntityBase {
  @ManyToOne(() => User, (user) => user.guestConnections)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Wedding, (wedding) => wedding.guests)
  @Field(() => Wedding)
  wedding: Wedding;

  @Column({ default: 'GUEST' })
  @Field()
  role: 'ADMIN' | 'GUEST' | 'PHOTOGRAPHER';

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  joinedAt: Date;
}

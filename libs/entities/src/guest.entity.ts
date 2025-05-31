import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { EntityBase } from './base.entity';
import { User } from './user.entity';
import { GuestRole } from '@app/types';
import { Event } from './event.entity';

registerEnumType(GuestRole, { name: 'GuestRole' });

@Entity()
@ObjectType()
@Unique('UQ_GUEST_USER_EVENT', ['user', 'event'])
export class Guest extends EntityBase {
  @ManyToOne(() => User, (user) => user.guestConnections, { eager: true })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Event, (event) => event.guests)
  @Field(() => Event)
  event: Event;

  @Column({ type: 'enum', enum: GuestRole, default: GuestRole.GUEST })
  @Field(() => GuestRole, { defaultValue: GuestRole.GUEST })
  role: GuestRole;
}

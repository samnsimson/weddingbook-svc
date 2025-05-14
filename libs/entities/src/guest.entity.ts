import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { EntityBase } from './base.entity';
import { User } from './user.entity';
import { Wedding } from './wedding.entity';
import { GuestRole } from '@app/types';

registerEnumType(GuestRole, { name: 'GuestRole' });

@Entity()
@ObjectType()
@Unique('UQ_GUEST_USER_WEDDING', ['user', 'wedding'])
export class Guest extends EntityBase {
  @ManyToOne(() => User, (user) => user.guestConnections, { eager: true })
  @Field(() => User)
  user: User;

  @ManyToOne(() => Wedding, (wedding) => wedding.guests)
  @Field(() => Wedding)
  wedding: Wedding;

  @Column({ type: 'enum', enum: GuestRole, default: GuestRole.GUEST })
  @Field(() => GuestRole, { defaultValue: GuestRole.GUEST })
  role: GuestRole;
}

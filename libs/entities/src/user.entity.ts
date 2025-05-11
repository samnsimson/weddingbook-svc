import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, OneToOne, Unique } from 'typeorm';
import { EntityBase } from './base.entity';
import { Guest } from './guest.entity';
import { Wedding } from './wedding.entity';

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

  @OneToOne(() => Wedding, (wedding) => wedding.owner, { nullable: true })
  @Field(() => Wedding)
  wedding: Wedding;
}

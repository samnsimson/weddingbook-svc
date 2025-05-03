import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
@ObjectType()
@Unique('UQ_USERNAME', ['username'])
@Unique('UQ_EMAIL', ['email'])
@Unique('UQ_PHONE', ['phone'])
export class User extends BaseEntity {
  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  email: string;

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
}

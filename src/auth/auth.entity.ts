/* eslint-disable prettier/prettier */
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { UserType } from './auth.model';
import { MemberEntity } from 'src/member/member.entity';

@Entity()
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  mobileNo: string;

  @Column({ unique: true })
  email: string;

  @Column()
  userType: UserType;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;

  // Relation with MemberEntity
  @OneToMany(() => MemberEntity, (memberEntity) => memberEntity.createdBy, {
    eager: true,
  })
  cMemberEntity: MemberEntity;
  @OneToMany(() => MemberEntity, (memberEntity) => memberEntity.updatedBy, {
    eager: true,
  })
  uMemberEntity: MemberEntity;
}

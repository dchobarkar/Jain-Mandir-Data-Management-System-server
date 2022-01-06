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
import { MInventoryEntity } from 'src/m-inventory/m-inventory.entity';
import { AccountEntity } from 'src/account/account.entity';

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
  @OneToMany(() => MemberEntity, (entity) => entity.createdBy, {
    eager: true,
  })
  cMemberEntity: MemberEntity;
  @OneToMany(() => MemberEntity, (entity) => entity.updatedBy, {
    eager: true,
  })
  uMemberEntity: MemberEntity;

  // Relation with MInventoryEntity
  @OneToMany(() => MInventoryEntity, (entity) => entity.createdBy, {
    eager: true,
  })
  cMInventoryEntity: MInventoryEntity;
  @OneToMany(() => MInventoryEntity, (entity) => entity.updatedBy, {
    eager: true,
  })
  uMInventoryEntity: MemberEntity;

  // Relation with AccountEntity
  @OneToMany(() => AccountEntity, (entity) => entity.createdBy, { eager: true })
  cAccountEntity: AccountEntity;
  @OneToMany(() => AccountEntity, (entity) => entity.updatedBy, { eager: true })
  uAccountEntity: AccountEntity;
}

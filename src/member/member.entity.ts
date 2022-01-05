/* eslint-disable prettier/prettier */
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { MemberType } from './member.model';
import { AuthEntity } from 'src/auth/auth.entity';

@Entity()
export class MemberEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ unique: true })
  mobileNo: string;

  @Column()
  status: MemberType;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;

  // Relation with AuthEntity
  @ManyToOne(() => AuthEntity, (authEntity) => authEntity.cMemberEntity, {
    eager: false,
  })
  createdBy: AuthEntity;
  @ManyToOne(() => AuthEntity, (authEntity) => authEntity.uMemberEntity, {
    eager: false,
  })
  updatedBy: AuthEntity;
}

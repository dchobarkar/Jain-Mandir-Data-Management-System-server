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

import { StatusType } from './account.model';
import { AuthEntity } from 'src/auth/auth.entity';

@Entity()
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  minimum: string;

  @Column()
  balance: string;

  @Column()
  status: StatusType;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;

  // Relation with AuthEntity
  @ManyToOne(() => AuthEntity, (entity) => entity.cAccountEntity, {
    eager: false,
  })
  createdBy: AuthEntity;
  @ManyToOne(() => AuthEntity, (entity) => entity.uAccountEntity, {
    eager: false,
  })
  updatedBy: AuthEntity;
}

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

import { StatusType } from './s-inventory.model';
import { AuthEntity } from 'src/auth/auth.entity';

@Entity()
export class SInventoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  number: string;

  @Column()
  status: StatusType;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;

  // Relation with AuthEntity
  @ManyToOne(() => AuthEntity, (entity) => entity.cSInventoryEntity, {
    eager: false,
  })
  createdBy: AuthEntity;
  @ManyToOne(() => AuthEntity, (entity) => entity.uSInventoryEntity, {
    eager: false,
  })
  updatedBy: AuthEntity;
}

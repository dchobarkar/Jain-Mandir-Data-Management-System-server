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

import { InventoryType, StatusType } from './m-inventory.model';
import { AuthEntity } from 'src/auth/auth.entity';

@Entity()
export class MInventoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column()
  type: InventoryType;

  @Column()
  number: string;

  @Column()
  remark: string;

  @Column()
  status: StatusType;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updatedAt: Date;

  // Relation with AuthEntity
  @ManyToOne(() => AuthEntity, (entity) => entity.cMInventoryEntity, {
    eager: false,
  })
  createdBy: AuthEntity;
  @ManyToOne(() => AuthEntity, (entity) => entity.uMInventoryEntity, {
    eager: false,
  })
  updatedBy: AuthEntity;
}

/* eslint-disable prettier/prettier */
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { MInventoryEntity } from './m-inventory.entity';
import {
  MInventoryDTO,
  MInventoryPromise,
  PaginationDTO,
} from './m-inventory.dto';
import { StatusType } from './m-inventory.model';
import { AuthEntity } from 'src/auth/auth.entity';

@EntityRepository(MInventoryEntity)
export class MInventoryRepository extends Repository<MInventoryEntity> {
  private logger = new Logger('MInventoryRepository');

  // Get item list
  async getItemList(
    paginationDTO: PaginationDTO,
  ): Promise<MInventoryPromise[]> {
    const { pageNo } = paginationDTO;
    const skip = (parseInt(pageNo) - 1) * 25;

    return await this.find({
      select: [
        'id',
        'name',
        'description',
        'type',
        'number',
        'remark',
        'status',
      ],
      where: { status: StatusType.REVIEWED },
      order: { name: 'ASC' },
      skip: skip,
      take: 25,
    });
  }

  // Create item
  async createItem(
    admin: AuthEntity,
    mInventoryDTO: MInventoryDTO,
  ): Promise<MInventoryPromise> {
    const { name, description, type, number, remark } = mInventoryDTO;

    const item = this.create({
      name,
      description,
      type,
      number,
      remark,
      status: StatusType.CREATEDRAFTED,
      createdBy: admin,
    });

    try {
      await this.save(item);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Given item already exists.');
      }

      this.logger.error(
        `Error in createItem. DTO: ${JSON.stringify(mInventoryDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      number: item.number,
      remark: item.remark,
      status: item.status,
    };
  }

  // Update details
  async updateDetails(
    admin: AuthEntity,
    id: string,
    mInventoryDTO: MInventoryDTO,
  ): Promise<MInventoryPromise> {
    const { name, description, type, number, remark } = mInventoryDTO;

    const tempItem = await this.findOne(id);

    tempItem.name = name;
    tempItem.description = description;
    tempItem.type = type;
    tempItem.number = number;
    tempItem.remark = remark;
    tempItem.status = StatusType.UPDATEDRAFTED;
    tempItem.updatedBy = admin;

    try {
      await this.save(tempItem);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Item name already exists.');
      }

      this.logger.error(
        `Error in updateDetails . DTO: ${JSON.stringify(mInventoryDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return {
      id: tempItem.id,
      name: tempItem.name,
      description: tempItem.description,
      type: tempItem.type,
      number: tempItem.number,
      remark: tempItem.remark,
      status: tempItem.status,
    };
  }

  // Delete item
  async deleteItem(admin: AuthEntity, id: string): Promise<void> {
    const tempItem = await this.findOne(id);

    tempItem.status = StatusType.DELETEDRAFTED;
    tempItem.updatedBy = admin;

    try {
      await this.save(tempItem);
    } catch (error) {
      this.logger.error(`Error in deleteItem.`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}

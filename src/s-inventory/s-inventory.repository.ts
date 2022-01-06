/* eslint-disable prettier/prettier */
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { SInventoryEntity } from './s-inventory.entity';
import {
  PaginationDTO,
  SInventoryDTO,
  SInventoryPromise,
} from './s-inventory.dto';
import { StatusType } from './s-inventory.model';
import { AuthEntity } from 'src/auth/auth.entity';

@EntityRepository(SInventoryEntity)
export class SInventoryRepository extends Repository<SInventoryEntity> {
  private logger = new Logger('SInventoryRepository');

  // Get item list
  async getItemList(
    paginationDTO: PaginationDTO,
  ): Promise<SInventoryPromise[]> {
    const { pageNo } = paginationDTO;
    const skip = (parseInt(pageNo) - 1) * 25;

    return await this.find({
      select: ['id', 'name', 'number', 'status'],
      where: { status: StatusType.REVIEWED },
      order: { name: 'ASC' },
      skip: skip,
      take: 25,
    });
  }

  // Create item
  async createItem(
    admin: AuthEntity,
    sInventoryDTO: SInventoryDTO,
  ): Promise<SInventoryPromise> {
    const { name, number } = sInventoryDTO;

    const item = this.create({
      name,
      number,
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
        `Error in createItem. DTO: ${JSON.stringify(sInventoryDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return {
      id: item.id,
      name: item.name,
      number: item.number,
      status: item.status,
    };
  }

  // Update item details
  async updateItem(
    admin: AuthEntity,
    id: string,
    sInventoryDTO: SInventoryDTO,
  ): Promise<SInventoryPromise> {
    const { name, number } = sInventoryDTO;

    const tempItem = await this.findOne(id);

    tempItem.name = name;
    tempItem.number = number;
    tempItem.status = StatusType.UPDATEDRAFTED;
    tempItem.updatedBy = admin;

    try {
      await this.save(tempItem);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Item name already exists.');
      }

      this.logger.error(
        `Error in updateItem. DTO: ${JSON.stringify(sInventoryDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return {
      id: tempItem.id,
      name: tempItem.name,
      number: tempItem.number,
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

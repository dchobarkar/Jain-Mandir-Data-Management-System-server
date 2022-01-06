import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MInventoryRepository } from './m-inventory.repository';
import {
  MInventoryDTO,
  MInventoryPromise,
  PaginationDTO,
} from './m-inventory.dto';
import { AuthEntity } from 'src/auth/auth.entity';

@Injectable()
export class MInventoryService {
  constructor(
    @InjectRepository(MInventoryRepository)
    private mInventoryRepository: MInventoryRepository,
  ) {}

  // Get item list
  async getItemList(
    paginationDTO: PaginationDTO,
  ): Promise<MInventoryPromise[]> {
    return this.mInventoryRepository.getItemList(paginationDTO);
  }

  // Create item
  async createItem(
    admin: AuthEntity,
    mInventoryDTO: MInventoryDTO,
  ): Promise<MInventoryPromise> {
    return this.mInventoryRepository.createItem(admin, mInventoryDTO);
  }

  // Update details
  async updateDetails(
    admin: AuthEntity,
    id: string,
    mInventoryDTO: MInventoryDTO,
  ): Promise<MInventoryPromise> {
    return this.mInventoryRepository.updateDetails(admin, id, mInventoryDTO);
  }

  // Delete item
  async deleteItem(admin: AuthEntity, id: string): Promise<void> {
    return this.mInventoryRepository.deleteItem(admin, id);
  }
}

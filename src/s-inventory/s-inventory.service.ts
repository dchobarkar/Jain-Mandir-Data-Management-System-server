import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SInventoryRepository } from './s-inventory.repository';
import {
  PaginationDTO,
  SInventoryDTO,
  SInventoryPromise,
} from './s-inventory.dto';
import { AuthEntity } from 'src/auth/auth.entity';

@Injectable()
export class SInventoryService {
  constructor(
    @InjectRepository(SInventoryRepository)
    private sInventoryRepository: SInventoryRepository,
  ) {}

  // Get item list
  async getItemList(
    paginationDTO: PaginationDTO,
  ): Promise<SInventoryPromise[]> {
    return this.sInventoryRepository.getItemList(paginationDTO);
  }

  // Create item
  async createItem(
    admin: AuthEntity,
    sInventoryDTO: SInventoryDTO,
  ): Promise<SInventoryPromise> {
    return this.sInventoryRepository.createItem(admin, sInventoryDTO);
  }

  // Update item details
  async updateItem(
    admin: AuthEntity,
    id: string,
    sInventoryDTO: SInventoryDTO,
  ): Promise<SInventoryPromise> {
    return this.sInventoryRepository.updateItem(admin, id, sInventoryDTO);
  }

  // Delete item
  async deleteItem(admin: AuthEntity, id: string): Promise<void> {
    return this.sInventoryRepository.deleteItem(admin, id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SInventoryService } from './s-inventory.service';
import {
  PaginationDTO,
  SInventoryDTO,
  SInventoryPromise,
} from './s-inventory.dto';
import { AuthEntity } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('s-inventory')
@UseGuards(AuthGuard())
export class SInventoryController {
  constructor(private sInventoryService: SInventoryService) {}

  // Get list of all inventory items
  @Get()
  getItemList(
    @Body() paginationDTO: PaginationDTO,
  ): Promise<SInventoryPromise[]> {
    return this.sInventoryService.getItemList(paginationDTO);
  }

  // Create item
  @Post()
  createItem(
    @GetUser() admin: AuthEntity,
    @Body() sInventoryDTO: SInventoryDTO,
  ): Promise<SInventoryPromise> {
    return this.sInventoryService.createItem(admin, sInventoryDTO);
  }

  // Update item details
  @Patch('/:id')
  updateItem(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
    @Body() sInventoryDTO: SInventoryDTO,
  ): Promise<SInventoryPromise> {
    return this.sInventoryService.updateItem(admin, id, sInventoryDTO);
  }

  // Delete item
  @Patch('/delete/:id')
  deleteItem(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
  ): Promise<void> {
    return this.sInventoryService.deleteItem(admin, id);
  }
}

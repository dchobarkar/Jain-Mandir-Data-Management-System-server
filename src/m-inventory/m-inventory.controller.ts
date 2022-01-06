import {
  Body,
  Controller,
  Param,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MInventoryService } from './m-inventory.service';
import {
  MInventoryDTO,
  MInventoryPromise,
  PaginationDTO,
} from './m-inventory.dto';
import { AuthEntity } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('m-inventory')
@UseGuards(AuthGuard())
export class MInventoryController {
  constructor(private mInventoryService: MInventoryService) {}

  // Get list of all inventory items
  @Get()
  getItemList(
    @Body() paginationDTO: PaginationDTO,
  ): Promise<MInventoryPromise[]> {
    return this.mInventoryService.getItemList(paginationDTO);
  }

  // Create item
  @Post()
  createItem(
    @GetUser() admin: AuthEntity,
    @Body() mInventoryDTO: MInventoryDTO,
  ): Promise<MInventoryPromise> {
    return this.mInventoryService.createItem(admin, mInventoryDTO);
  }

  // Update item details
  @Patch('/:id')
  updateDetails(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
    @Body() mInventoryDTO: MInventoryDTO,
  ): Promise<MInventoryPromise> {
    return this.mInventoryService.updateDetails(admin, id, mInventoryDTO);
  }

  // Delete member
  @Patch('/delete/:id')
  deleteItem(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
  ): Promise<void> {
    return this.mInventoryService.deleteItem(admin, id);
  }
}

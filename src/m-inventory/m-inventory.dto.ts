/* eslint-disable prettier/prettier */
import { IsEnum, IsNumberString, IsString, IsUUID } from 'class-validator';

import { InventoryType, StatusType } from './m-inventory.model';

// MInventory DTO
export class MInventoryDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(InventoryType)
  type: InventoryType;

  @IsNumberString()
  number: string;

  @IsString()
  remark: string;
}

// Pagination DTO
export class PaginationDTO {
  @IsNumberString()
  pageNo: string;
}

// MInventoryPromise DTO
export class MInventoryPromise {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(InventoryType)
  type: InventoryType;

  @IsNumberString()
  number: string;

  @IsString()
  remark: string;

  @IsEnum(StatusType)
  status: StatusType;
}

/* eslint-disable prettier/prettier */
import { IsEnum, IsNumberString, IsString, IsUUID } from 'class-validator';

import { StatusType } from './s-inventory.model';

// SInventory DTO
export class SInventoryDTO {
  @IsString()
  name: string;

  @IsNumberString()
  number: string;
}

// Pagination DTO
export class PaginationDTO {
  @IsNumberString()
  pageNo: string;
}

// SInventoryPromise DTO
export class SInventoryPromise {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumberString()
  number: string;

  @IsEnum(StatusType)
  status: StatusType;
}

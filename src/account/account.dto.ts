/* eslint-disable prettier/prettier */
import { IsEnum, IsNumberString, IsString, IsUUID } from 'class-validator';

import { StatusType } from './account.model';

//  DTO
export class AccountDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumberString()
  minimum: string;
}

// AccountPromise DTO
export class AccountPromise {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumberString()
  minimum: string;

  @IsEnum(StatusType)
  status: StatusType;
}

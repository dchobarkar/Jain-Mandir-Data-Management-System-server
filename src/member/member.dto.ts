/* eslint-disable prettier/prettier */
import { IsNumberString, IsString, IsUUID, Length } from 'class-validator';

// Member DTO
export class MemberDTO {
  @IsString()
  name: string;

  @IsNumberString()
  @Length(10, 10)
  mobileNo: string;

  @IsString()
  address: string;
}

// Pagination DTO
export class PaginationDTO {
  @IsNumberString()
  pageNo: string;
}

// MemberPromise DTO
export class MemberPromise {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumberString()
  @Length(10, 10)
  mobileNo: string;

  @IsString()
  address: string;
}

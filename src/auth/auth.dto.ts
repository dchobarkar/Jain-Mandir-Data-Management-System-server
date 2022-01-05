/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserType } from './auth.model';

// Signup DTO
export class SignupDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(10, 10)
  mobileNo: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

// Login DTO
export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

// Details DTO
export class DetailsDTO {
  @IsString()
  name: string;

  @IsNumberString()
  @Length(10, 10)
  mobileNo: string;
}

// Password DTO
export class PasswordDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

// SignupPromise DTO
export class SignupPromise {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(10, 10)
  mobileNo: string;

  @IsEnum(UserType)
  userType: UserType;
}

// DetailsPromise DTO
export class DetailsPromise {
  @IsString()
  name: string;

  @IsNumberString()
  @Length(10, 10)
  mobileNo: string;
}

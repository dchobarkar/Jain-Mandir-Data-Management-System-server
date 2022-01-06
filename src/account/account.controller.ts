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

import { AccountService } from './account.service';
import { AccountDTO, AccountPromise } from './account.dto';
import { AuthEntity } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('account')
@UseGuards(AuthGuard())
export class AccountController {
  constructor(private accountService: AccountService) {}

  // Get list of all accounts
  @Get()
  getAccountList(): Promise<AccountPromise[]> {
    return this.accountService.getAccountList();
  }

  // Create account
  @Post()
  createAccount(
    @GetUser() admin: AuthEntity,
    @Body() accountDTO: AccountDTO,
  ): Promise<AccountPromise> {
    return this.accountService.createAccount(admin, accountDTO);
  }

  // Update account details
  @Patch('/:id')
  updateAccount(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
    @Body() accountDTO: AccountDTO,
  ): Promise<AccountPromise> {
    return this.accountService.updateAccount(admin, id, accountDTO);
  }

  // Delete account
  @Patch('/delete/:id')
  deleteAccount(
    @GetUser() admin: AuthEntity,
    @Param('id') id: string,
  ): Promise<void> {
    return this.accountService.deleteAccount(admin, id);
  }
}

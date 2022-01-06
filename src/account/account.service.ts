import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AccountRepository } from './account.repository';
import { AccountDTO, AccountPromise } from './account.dto';
import { AuthEntity } from 'src/auth/auth.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountRepository)
    private accountRepository: AccountRepository,
  ) {}

  // Get account list
  async getAccountList(): Promise<AccountPromise[]> {
    return this.accountRepository.getAccountList();
  }

  // Create account
  async createAccount(
    admin: AuthEntity,
    accountDTO: AccountDTO,
  ): Promise<AccountPromise> {
    return this.accountRepository.createAccount(admin, accountDTO);
  }

  // Update account details
  async updateAccount(
    admin: AuthEntity,
    id: string,
    accountDTO: AccountDTO,
  ): Promise<AccountPromise> {
    return this.accountRepository.updateAccount(admin, id, accountDTO);
  }

  // Delete Account
  async deleteAccount(admin: AuthEntity, id: string): Promise<void> {
    return this.accountRepository.deleteAccount(admin, id);
  }
}

/* eslint-disable prettier/prettier */
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { AccountEntity } from './account.entity';
import { AccountDTO, AccountPromise } from './account.dto';
import { StatusType } from './account.model';
import { AuthEntity } from 'src/auth/auth.entity';

@EntityRepository(AccountEntity)
export class AccountRepository extends Repository<AccountEntity> {
  private logger = new Logger('AccountRepository');

  // Get account list
  async getAccountList(): Promise<AccountPromise[]> {
    return await this.find({
      select: ['id', 'name', 'description', 'minimum', 'balance', 'status'],
      where: { status: StatusType.CREATEDRAFTED },
      order: { name: 'ASC' },
    });
  }

  // Create account
  async createAccount(
    admin: AuthEntity,
    accountDTO: AccountDTO,
  ): Promise<AccountPromise> {
    const { name, description, minimum } = accountDTO;

    const account = this.create({
      name,
      description,
      minimum,
      balance: '0',
      status: StatusType.CREATEDRAFTED,
      createdBy: admin,
    });

    try {
      await this.save(account);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Given account already exists.');
      }

      this.logger.error(
        `Error in createAccount. DTO: ${JSON.stringify(accountDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    return {
      id: account.id,
      name: account.name,
      description: account.description,
      minimum: account.minimum,
      status: account.status,
    };
  }

  // Update account details
  async updateAccount(
    admin: AuthEntity,
    id: string,
    accountDTO: AccountDTO,
  ): Promise<AccountPromise> {
    const { name, description, minimum } = accountDTO;

    const tempAccount = await this.findOne(id);

    tempAccount.name = name;
    tempAccount.description = description;
    tempAccount.minimum = minimum;
    tempAccount.status = StatusType.UPDATEDRAFTED;
    tempAccount.updatedBy = admin;

    try {
      await this.save(tempAccount);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Given account already exists.');
      }

      this.logger.error(`Error in updateAccount. DTO: ${accountDTO}`),
        error.stack;
      throw new InternalServerErrorException();
    }

    return {
      id: tempAccount.id,
      name: tempAccount.name,
      description: tempAccount.description,
      minimum: tempAccount.minimum,
      status: tempAccount.status,
    };
  }

  // Delete account
  async deleteAccount(admin: AuthEntity, id: string): Promise<void> {
    const tempAccount = await this.findOne(id);

    tempAccount.status = StatusType.DELETEDRAFTED;
    tempAccount.updatedBy = admin;

    try {
      await this.save(tempAccount);
    } catch (error) {
      this.logger.error(`Error in deleteAccount.`, error.stack);
      throw new InternalServerErrorException();
    }
  }
}

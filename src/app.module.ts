import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { MInventoryModule } from './m-inventory/m-inventory.module';
import { AccountModule } from './account/account.module';
import { SInventoryModule } from './s-inventory/s-inventory.module';

import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MemberModule,
    MInventoryModule,
    AccountModule,
    SInventoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

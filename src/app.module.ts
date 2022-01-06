import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { MInventoryModule } from './m-inventory/m-inventory.module';
import { AccountModule } from './account/account.module';

import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    MemberModule,
    MInventoryModule,
    AccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

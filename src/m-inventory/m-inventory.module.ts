import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MInventoryController } from './m-inventory.controller';
import { MInventoryRepository } from './m-inventory.repository';
import { MInventoryService } from './m-inventory.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MInventoryRepository]), AuthModule],
  controllers: [MInventoryController],
  providers: [MInventoryService],
})
export class MInventoryModule {}

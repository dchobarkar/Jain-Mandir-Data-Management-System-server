import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SInventoryController } from './s-inventory.controller';
import { SInventoryService } from './s-inventory.service';
import { SInventoryRepository } from './s-inventory.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SInventoryRepository]), AuthModule],
  controllers: [SInventoryController],
  providers: [SInventoryService],
})
export class SInventoryModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';

@Module({
  providers: [PrismaService, UnitsService],
  controllers: [UnitsController]
})
export class UnitsModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeavesService } from './leaves.service';
import { LeavesController } from './leaves.controller';

@Module({
  providers: [PrismaService, LeavesService],
  controllers: [LeavesController]
})
export class LeavesModule {}

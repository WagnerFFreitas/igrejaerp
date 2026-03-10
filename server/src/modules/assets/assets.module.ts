import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';

@Module({
  providers: [PrismaService, AssetsService],
  controllers: [AssetsController]
})
export class AssetsModule {}

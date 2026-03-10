import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  providers: [PrismaService, TransactionsService],
  controllers: [TransactionsController]
})
export class TransactionsModule {}

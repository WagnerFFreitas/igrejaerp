import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';

@Module({
  providers: [PrismaService, AccountsService],
  controllers: [AccountsController]
})
export class AccountsModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UnitsModule } from './units/units.module';
import { MembersModule } from './members/members.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AssetsModule } from './assets/assets.module';
import { LeavesModule } from './leaves/leaves.module';

@Module({
  imports: [
    UnitsModule,
    MembersModule,
    AccountsModule,
    TransactionsModule,
    AssetsModule,
    LeavesModule
  ],
  providers: [PrismaService]
})
export class AppModule {}

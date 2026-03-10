import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';

@Module({
  providers: [PrismaService, MembersService],
  controllers: [MembersController]
})
export class MembersModule {}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  findAll(unitId?: string) {
    if (unitId) return this.prisma.account.findMany({ where: { unitId } });
    return this.prisma.account.findMany();
  }

  create(data: any) {
    return this.prisma.account.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.account.update({ where: { id }, data });
  }
}

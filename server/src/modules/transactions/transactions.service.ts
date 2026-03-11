import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  findAll(unitId?: string) {
    if (unitId) return this.prisma.transaction.findMany({ where: { unitId }, orderBy: { date: 'desc' } });
    return this.prisma.transaction.findMany({ orderBy: { date: 'desc' } });
  }

  create(data: any) {
    return this.prisma.transaction.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.transaction.update({ where: { id }, data });
  }
}

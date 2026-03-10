import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeavesService {
  constructor(private prisma: PrismaService) {}

  findAll(unitId?: string) {
    if (unitId) return this.prisma.employeeLeave.findMany({ where: { unitId } });
    return this.prisma.employeeLeave.findMany();
  }

  create(data: any) {
    return this.prisma.employeeLeave.create({ data });
  }
}

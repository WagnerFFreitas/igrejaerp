import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  findAll(unitId?: string) {
    if (unitId) return this.prisma.asset.findMany({ where: { unitId } });
    return this.prisma.asset.findMany();
  }

  create(data: any) {
    return this.prisma.asset.create({ data });
  }
}

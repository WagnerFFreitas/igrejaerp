import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  findAll(unitId?: string) {
    if (unitId) return this.prisma.member.findMany({ where: { unitId } });
    return this.prisma.member.findMany();
  }

  create(data: any) {
    return this.prisma.member.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.member.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.member.delete({ where: { id } });
  }
}

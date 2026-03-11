import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LeavesService } from './leaves.service';

@Controller('leaves')
export class LeavesController {
  constructor(private service: LeavesService) {}

  @Get()
  findAll(@Query('unitId') unitId?: string) {
    return this.service.findAll(unitId);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }
}

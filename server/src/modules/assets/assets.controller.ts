import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private service: AssetsService) {}

  @Get()
  findAll(@Query('unitId') unitId?: string) {
    return this.service.findAll(unitId);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }
}

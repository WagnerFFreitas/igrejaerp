import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private service: AccountsService) {}

  @Get()
  findAll(@Query('unitId') unitId?: string) {
    return this.service.findAll(unitId);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }
}

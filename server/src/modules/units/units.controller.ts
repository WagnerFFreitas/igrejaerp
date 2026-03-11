import { Controller, Get } from '@nestjs/common';
import { UnitsService } from './units.service';

@Controller('units')
export class UnitsController {
  constructor(private service: UnitsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}

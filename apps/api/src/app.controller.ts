import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { HealthCheck } from '@food-delivery/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  healthCheck(): HealthCheck {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  @Get()
  status() {
    return { ok: true, db: this.connection.readyState === 1 ? 'up' : 'down' };
  }
}

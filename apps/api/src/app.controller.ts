import { Controller, Get, Inject } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import schema from './db/schema';

@Controller()
export class AppController {
  constructor(@Inject('DB') private db: NodePgDatabase<typeof schema>) {}

  @Get('db-test')
  async dbTest() {
    return this.db.select().from(schema.users).limit(10);
  }
}

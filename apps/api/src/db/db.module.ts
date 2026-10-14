import { neon } from '@neondatabase/serverless';
import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-http';
import schema from './schema';

@Global()
@Module({
  providers: [
    {
      provide: 'DB',
      useFactory: () => {
        const sql = neon(process.env.DATABASE_URL!);
        return drizzle(sql, { schema });
      },
    },
  ],
  exports: ['DB'],
})
export class DBModule {}

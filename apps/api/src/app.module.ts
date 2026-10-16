import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { ResturantsModule } from './resturants/resturant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    DBModule,
    AuthModule,
    ResturantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

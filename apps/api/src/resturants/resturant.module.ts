import { Module } from '@nestjs/common';
import { ResturantsController } from './resturant.controller';
import { ResturantService } from './resturant.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ResturantsController],
  providers: [ResturantService],
})
export class ResturantsModule {}

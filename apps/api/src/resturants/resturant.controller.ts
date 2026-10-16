import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResturantService } from './resturant.service';
import { Request } from 'express';
import { JwtPayload, UserRole } from '@food-delivery/types';
import { AuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateResturantDto } from './dto/create-resturant.dto';
import { UpdateResturantDto } from './dto/update-resturant.dto';

type AuthenticatedRequest = Request & {
  user: JwtPayload;
};

@Controller(['restaurants', 'resturants'])
export class ResturantsController {
  constructor(private readonly resturantService: ResturantService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRole.RESTURANT_OWNER)
  @UseGuards(RolesGuard)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateResturantDto,
  ) {
    return this.resturantService.create(req.user.sub, dto);
  }

  @Get('mine')
  @UseGuards(AuthGuard)
  async findMine(@Req() req: AuthenticatedRequest) {
    return this.resturantService.findMine(req.user.sub);
  }

  @Get(':resturantId')
  async findById(@Param('resturantId') resturantId: string) {
    return this.resturantService.findById(resturantId);
  }

  @Put(':resturantId')
  @Patch(':resturantId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.RESTURANT_OWNER)
  @UseGuards(RolesGuard)
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('resturantId') resturantId: string,
    @Body() dto: UpdateResturantDto,
  ) {
    return this.resturantService.update(resturantId, dto, req.user.sub);
  }

  @Delete(':resturantId')
  @UseGuards(AuthGuard)
  @Roles(UserRole.RESTURANT_OWNER)
  @UseGuards(RolesGuard)
  async delete(
    @Req() req: AuthenticatedRequest,
    @Param('resturantId') resturantId: string,
  ) {
    return this.resturantService.delete(resturantId, req.user.sub);
  }
}

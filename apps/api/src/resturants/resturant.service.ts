import { Inject, Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import schema from '../db/schema';
import { CreateResturantDto } from './dto/create-resturant.dto';
import { eq } from 'drizzle-orm';
import { UpdateResturantDto } from './dto/update-resturant.dto';

@Injectable()
export class ResturantService {
  constructor(
    @Inject('DB') private readonly db: NeonHttpDatabase<typeof schema>,
  ) {}

  async create(ownerId: string, dto: CreateResturantDto) {
    const existing = await this.db.query.resturants.findFirst({
      where: eq(schema.resturants.ownerId, ownerId),
    });

    if (existing) {
      throw new Error('You already have a resturant');
    }

    const [resturant] = await this.db
      .insert(schema.resturants)
      .values({
        ...dto,
        ownerId,
      })
      .returning();

    return resturant;
  }

  async findMine(ownerId: string) {
    return this.db.query.resturants.findFirst({
      where: eq(schema.resturants.ownerId, ownerId),
    });
  }

  async findById(resturantId: string) {
    const resturant = await this.db.query.resturants.findFirst({
      where: eq(schema.resturants.id, resturantId),
    });

    if (!resturant) {
      throw new Error('Resturant not found');
    }

    return resturant;
  }

  async update(resturantId: string, dto: UpdateResturantDto, ownerId: string) {
    const resturant = await this.findById(resturantId);

    if (!resturant) {
      throw new Error('Resturant not found');
    }

    if (resturant.ownerId !== ownerId) {
      throw new Error('You are not authorized to update this resturant');
    }

    const [updatedResturant] = await this.db
      .update(schema.resturants)
      .set(dto)
      .where(eq(schema.resturants.id, resturantId))
      .returning();

    return updatedResturant;
  }

  async delete(resturantId: string, ownerId: string) {
    const resturant = await this.findById(resturantId);

    if (!resturant) {
      throw new Error('Resturant not found');
    }

    if (resturant.ownerId !== ownerId) {
      throw new Error('You are not authorized to delete this resturant');
    }

    await this.db
      .delete(schema.resturants)
      .where(eq(schema.resturants.id, resturantId));

    return { message: 'Resturant deleted successfully' };
  }
}

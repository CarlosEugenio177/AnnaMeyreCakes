import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getCatalog() {
    const [doughs, fillings, toppings, cakeSizes, sweetTypes] =
      await this.prisma.$transaction([
        this.prisma.dough.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' },
        }),
        this.prisma.filling.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' },
        }),
        this.prisma.topping.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' },
        }),
        this.prisma.cakeSize.findMany({
          where: { isActive: true },
          orderBy: { slices: 'asc' },
        }),
        this.prisma.sweetType.findMany({
          where: { isActive: true },
          orderBy: { name: 'asc' },
          include: {
            flavors: {
              where: { isActive: true },
              orderBy: { name: 'asc' },
            },
          },
        }),
      ]);

    return {
      doughs,
      fillings,
      toppings,
      cakeSizes,
      sweetTypes,
    };
  }
}

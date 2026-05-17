import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UpsertCakeSizeDto,
  UpsertDoughDto,
  UpsertFillingDto,
  UpsertSweetFlavorDto,
  UpsertSweetTypeDto,
  UpsertToppingDto,
} from './dto/catalog-admin.dto';

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

  async getAdminOptions() {
    const [doughs, fillings, toppings, cakeSizes, sweetTypes] =
      await this.prisma.$transaction([
        this.prisma.dough.findMany({ orderBy: { name: 'asc' } }),
        this.prisma.filling.findMany({ orderBy: { name: 'asc' } }),
        this.prisma.topping.findMany({ orderBy: { name: 'asc' } }),
        this.prisma.cakeSize.findMany({ orderBy: { slices: 'asc' } }),
        this.prisma.sweetType.findMany({
          orderBy: { name: 'asc' },
          include: { flavors: { orderBy: { name: 'asc' } } },
        }),
      ]);

    return { doughs, fillings, toppings, cakeSizes, sweetTypes };
  }

  createDough(dto: UpsertDoughDto) {
    return this.prisma.dough.create({ data: this.withActive(dto) });
  }

  async updateDough(id: string, dto: UpsertDoughDto) {
    await this.ensureExists(this.prisma.dough.findUnique({ where: { id } }));
    return this.prisma.dough.update({ where: { id }, data: this.withActive(dto) });
  }

  async deactivateDough(id: string) {
    await this.ensureExists(this.prisma.dough.findUnique({ where: { id } }));
    return this.prisma.dough.update({ where: { id }, data: { isActive: false } });
  }

  createFilling(dto: UpsertFillingDto) {
    return this.prisma.filling.create({ data: this.withActive(dto) });
  }

  async updateFilling(id: string, dto: UpsertFillingDto) {
    await this.ensureExists(this.prisma.filling.findUnique({ where: { id } }));
    return this.prisma.filling.update({ where: { id }, data: this.withActive(dto) });
  }

  async deactivateFilling(id: string) {
    await this.ensureExists(this.prisma.filling.findUnique({ where: { id } }));
    return this.prisma.filling.update({ where: { id }, data: { isActive: false } });
  }

  createTopping(dto: UpsertToppingDto) {
    return this.prisma.topping.create({ data: this.withActive(dto) });
  }

  async updateTopping(id: string, dto: UpsertToppingDto) {
    await this.ensureExists(this.prisma.topping.findUnique({ where: { id } }));
    return this.prisma.topping.update({ where: { id }, data: this.withActive(dto) });
  }

  async deactivateTopping(id: string) {
    await this.ensureExists(this.prisma.topping.findUnique({ where: { id } }));
    return this.prisma.topping.update({ where: { id }, data: { isActive: false } });
  }

  createCakeSize(dto: UpsertCakeSizeDto) {
    return this.prisma.cakeSize.create({ data: this.withActive(dto) });
  }

  async updateCakeSize(id: string, dto: UpsertCakeSizeDto) {
    await this.ensureExists(this.prisma.cakeSize.findUnique({ where: { id } }));
    return this.prisma.cakeSize.update({ where: { id }, data: this.withActive(dto) });
  }

  async deactivateCakeSize(id: string) {
    await this.ensureExists(this.prisma.cakeSize.findUnique({ where: { id } }));
    return this.prisma.cakeSize.update({ where: { id }, data: { isActive: false } });
  }

  createSweetType(dto: UpsertSweetTypeDto) {
    return this.prisma.sweetType.create({ data: this.withActive(dto) });
  }

  async updateSweetType(id: string, dto: UpsertSweetTypeDto) {
    await this.ensureExists(this.prisma.sweetType.findUnique({ where: { id } }));
    return this.prisma.sweetType.update({ where: { id }, data: this.withActive(dto) });
  }

  async deactivateSweetType(id: string) {
    await this.ensureExists(this.prisma.sweetType.findUnique({ where: { id } }));
    return this.prisma.sweetType.update({ where: { id }, data: { isActive: false } });
  }

  createSweetFlavor(dto: UpsertSweetFlavorDto) {
    return this.prisma.sweetFlavor.create({ data: this.withActive(dto) });
  }

  async updateSweetFlavor(id: string, dto: UpsertSweetFlavorDto) {
    await this.ensureExists(this.prisma.sweetFlavor.findUnique({ where: { id } }));
    return this.prisma.sweetFlavor.update({ where: { id }, data: this.withActive(dto) });
  }

  async deactivateSweetFlavor(id: string) {
    await this.ensureExists(this.prisma.sweetFlavor.findUnique({ where: { id } }));
    return this.prisma.sweetFlavor.update({ where: { id }, data: { isActive: false } });
  }

  private async ensureExists<T>(record: Promise<T | null>) {
    if (!(await record)) {
      throw new NotFoundException('Opcao nao encontrada');
    }
  }

  private withActive<T extends { isActive?: boolean }>(dto: T): T & { isActive: boolean } {
    return {
      ...dto,
      isActive: dto.isActive ?? true,
    };
  }
}

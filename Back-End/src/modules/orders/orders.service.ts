import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductType, StoreStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { decimalToNumber } from '../../common/utils/money';
import { PrismaService } from '../../prisma/prisma.service';
import { CustomersService } from '../customers/customers.service';
import { SettingsService } from '../settings/settings.service';
import { CreateCakeOrderDto } from './dto/create-cake-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateSweetOrderDto } from './dto/create-sweet-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type CalculatedCake = {
  unitPrice: Decimal;
  fillingExtraPrice: Decimal;
  cake: CreateCakeOrderDto;
};

type CalculatedSweet = {
  unitPrice: Decimal;
  totalPrice: Decimal;
  maxFlavors: number;
  sweet: CreateSweetOrderDto;
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settingsService: SettingsService,
    private readonly customersService: CustomersService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const settings = await this.settingsService.getSettings();

    if (settings.storeStatus === StoreStatus.CLOSED) {
      throw new ForbiddenException('Loja fechada');
    }

    this.validateDesiredDate(dto.desiredDate);

    const calculatedCake = await this.calculateCake(dto.cake);
    const calculatedSweets = await Promise.all(
      (dto.sweets ?? []).map((sweet) => this.calculateSweet(sweet)),
    );

    const totalPrice = calculatedSweets.reduce(
      (total, sweet) => total.plus(sweet.totalPrice),
      calculatedCake.unitPrice,
    );
    const depositPrice = totalPrice.div(2).toDecimalPlaces(2);
    const remainingPrice = totalPrice.minus(depositPrice).toDecimalPlaces(2);
    const orderCode = await this.generateOrderCode();
    const customer = await this.customersService.upsertFromContact(dto);
    const contactSnapshot = this.customersService.toContactSnapshot(dto);
    const whatsappMessage = this.buildWhatsAppMessage({
      orderCode,
      dto,
      totalPrice,
      depositPrice,
      remainingPrice,
    });

    const order = await this.prisma.order.create({
      data: {
        orderCode,
        totalPrice,
        depositPrice,
        remainingPrice,
        desiredDate: new Date(dto.desiredDate),
        notes: dto.notes,
        contactSnapshot,
        whatsappMessage,
        customerId: customer.id,
        items: {
          create: [
            {
              productType: ProductType.CAKE,
              quantity: 1,
              unitPrice: calculatedCake.unitPrice,
              totalPrice: calculatedCake.unitPrice,
              cakeDetail: {
                create: {
                  doughId: calculatedCake.cake.doughId,
                  cakeSizeId: calculatedCake.cake.cakeSizeId,
                  filling1Id: calculatedCake.cake.filling1Id,
                  filling2Id: calculatedCake.cake.filling2Id,
                  toppingId: calculatedCake.cake.toppingId,
                  fillingExtraPrice: calculatedCake.fillingExtraPrice,
                },
              },
            },
            ...calculatedSweets.map((sweet) => ({
              productType: ProductType.SWEET,
              quantity: sweet.sweet.quantity,
              unitPrice: sweet.unitPrice,
              totalPrice: sweet.totalPrice,
              sweetDetail: {
                create: {
                  sweetTypeId: sweet.sweet.sweetTypeId,
                  quantity: sweet.sweet.quantity,
                  maxFlavors: sweet.maxFlavors,
                  flavors: {
                    create: sweet.sweet.sweetFlavorIds.map((sweetFlavorId) => ({
                      sweetFlavorId,
                    })),
                  },
                },
              },
            })),
          ],
        },
      },
      include: this.orderInclude(),
    });

    return {
      order,
      whatsapp: {
        number: settings.whatsappNumber,
        message: whatsappMessage,
        link: `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
          whatsappMessage,
        )}`,
      },
    };
  }

  getAdminOrders() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: this.orderInclude(),
    });
  }

  async getAdminOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: this.orderInclude(),
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    await this.ensureOrderExists(id);

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: this.orderInclude(),
    });
  }

  async ensureOrderExists(id: string): Promise<void> {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }
  }

  private async calculateCake(cake: CreateCakeOrderDto): Promise<CalculatedCake> {
    const [dough, cakeSize, filling1, filling2, topping] =
      await this.prisma.$transaction([
        this.prisma.dough.findFirst({
          where: { id: cake.doughId, isActive: true },
        }),
        this.prisma.cakeSize.findFirst({
          where: { id: cake.cakeSizeId, isActive: true },
        }),
        this.prisma.filling.findFirst({
          where: { id: cake.filling1Id, isActive: true },
        }),
        this.prisma.filling.findFirst({
          where: { id: cake.filling2Id, isActive: true },
        }),
        this.prisma.topping.findFirst({
          where: { id: cake.toppingId, isActive: true },
        }),
      ]);

    if (!dough || !cakeSize || !filling1 || !filling2 || !topping) {
      throw new NotFoundException('Item do catálogo não encontrado');
    }

    const fillingExtraPrice = filling1.extraPrice.plus(filling2.extraPrice);
    const unitPrice = cakeSize.price.plus(fillingExtraPrice);

    return {
      cake,
      fillingExtraPrice,
      unitPrice,
    };
  }

  private async calculateSweet(
    sweet: CreateSweetOrderDto,
  ): Promise<CalculatedSweet> {
    const maxFlavors = this.getMaxSweetFlavors(sweet.quantity);

    if (sweet.sweetFlavorIds.length > maxFlavors) {
      throw new BadRequestException(
        `Quantidade ${sweet.quantity} permite no máximo ${maxFlavors} sabor(es)`,
      );
    }

    const sweetType = await this.prisma.sweetType.findFirst({
      where: { id: sweet.sweetTypeId, isActive: true },
      include: {
        flavors: {
          where: {
            id: { in: sweet.sweetFlavorIds },
            isActive: true,
          },
        },
      },
    });

    if (!sweetType || sweetType.flavors.length !== sweet.sweetFlavorIds.length) {
      throw new NotFoundException('Docinho ou sabor não encontrado');
    }

    const invalidFlavor = sweetType.flavors.some(
      (flavor) => flavor.sweetTypeId !== sweet.sweetTypeId,
    );

    if (invalidFlavor) {
      throw new BadRequestException('Sabor não pertence ao tipo de docinho');
    }

    const unitPrice = sweetType.pricePer100.div(100).toDecimalPlaces(2);
    const totalPrice = unitPrice.mul(sweet.quantity).toDecimalPlaces(2);

    return {
      sweet,
      unitPrice,
      totalPrice,
      maxFlavors,
    };
  }

  private getMaxSweetFlavors(quantity: number): number {
    const rules = new Map<number, number>([
      [30, 1],
      [50, 2],
      [100, 4],
    ]);
    const maxFlavors = rules.get(quantity);

    if (!maxFlavors) {
      throw new BadRequestException('Quantidade de docinhos inválida');
    }

    return maxFlavors;
  }

  private validateDesiredDate(desiredDate: string): void {
    const date = new Date(desiredDate);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Data desejada inválida');
    }

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    minDate.setHours(0, 0, 0, 0);

    if (date < minDate) {
      throw new BadRequestException(
        'Data de entrega deve ter antecedência mínima de 3 dias',
      );
    }
  }

  private async generateOrderCode(): Promise<string> {
    const today = new Date();
    const datePart = today.toISOString().slice(0, 10).replaceAll('-', '');

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const randomPart = Math.floor(1000 + Math.random() * 9000).toString();
      const orderCode = `AMC-${datePart}-${randomPart}`;
      const existing = await this.prisma.order.findUnique({
        where: { orderCode },
      });

      if (!existing) {
        return orderCode;
      }
    }

    throw new BadRequestException('Não foi possível gerar o código do pedido');
  }

  private buildWhatsAppMessage(params: {
    orderCode: string;
    dto: CreateOrderDto;
    totalPrice: Decimal;
    depositPrice: Decimal;
    remainingPrice: Decimal;
  }): string {
    const { orderCode, dto, totalPrice, depositPrice, remainingPrice } = params;

    return [
      '*Pedido Anna Meyre Cakes*',
      '',
      `Codigo: ${orderCode}`,
      `Cliente: ${dto.customerName}`,
      `WhatsApp: ${dto.customerPhone}`,
      `Data desejada: ${dto.desiredDate}`,
      '',
      '*Resumo financeiro*',
      `Valor total: R$ ${decimalToNumber(totalPrice).toFixed(2)}`,
      `Entrada 50%: R$ ${decimalToNumber(depositPrice).toFixed(2)}`,
      `Restante: R$ ${decimalToNumber(remainingPrice).toFixed(2)}`,
      '',
      `Observacoes: ${dto.notes ?? 'Sem observacoes'}`,
    ].join('\n');
  }

  private orderInclude() {
    return {
      customer: true,
      items: {
        include: {
          cakeDetail: {
            include: {
              dough: true,
              cakeSize: true,
              filling1: true,
              filling2: true,
              topping: true,
            },
          },
          sweetDetail: {
            include: {
              sweetType: true,
              flavors: {
                include: {
                  sweetFlavor: true,
                },
              },
            },
          },
        },
      },
      payments: true,
    };
  }
}

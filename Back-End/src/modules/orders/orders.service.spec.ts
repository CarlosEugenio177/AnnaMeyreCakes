import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProductType, StoreStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  const prisma = {
    order: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    dough: { findFirst: jest.fn() },
    cakeSize: { findFirst: jest.fn() },
    filling: { findFirst: jest.fn() },
    topping: { findFirst: jest.fn() },
    sweetType: { findFirst: jest.fn() },
    $transaction: jest.fn(),
  };

  const settingsService = {
    getSettings: jest.fn(),
  };

  const customersService = {
    upsertFromContact: jest.fn(),
    toContactSnapshot: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.$transaction.mockImplementation((input: unknown) => {
      if (Array.isArray(input)) {
        return Promise.all(input);
      }

      if (typeof input === 'function') {
        return input(prisma);
      }

      return input;
    });
  });

  function makeService() {
    return new OrdersService(
      prisma as never,
      settingsService as never,
      customersService as never,
    );
  }

  function validOrderDto() {
    return {
      customerName: 'Cliente Teste',
      customerPhone: '5599999999999',
      desiredDate: '2030-01-10T00:00:00.000Z',
      notes: 'Sem lactose',
      cake: {
        doughId: '11111111-1111-4111-8111-111111111111',
        cakeSizeId: '22222222-2222-4222-8222-222222222215',
        filling1Id: '33333333-3333-4333-8333-333333333301',
        filling2Id: '33333333-3333-4333-8333-333333333302',
        toppingId: '55555555-5555-4555-8555-555555555551',
      },
      sweets: [
        {
          sweetTypeId: '44444444-4444-4444-8444-444444444441',
          quantity: 50,
          sweetFlavorIds: [
            '66666666-6666-4666-8666-444441000001',
            '66666666-6666-4666-8666-444441000002',
          ],
        },
      ],
    };
  }

  function mockActiveCakeCatalog() {
    prisma.dough.findFirst.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
    });
    prisma.cakeSize.findFirst.mockResolvedValue({
      id: '22222222-2222-4222-8222-222222222215',
      price: new Decimal(140),
    });
    prisma.filling.findFirst
      .mockResolvedValueOnce({
        id: '33333333-3333-4333-8333-333333333301',
        extraPrice: new Decimal(30),
      })
      .mockResolvedValueOnce({
        id: '33333333-3333-4333-8333-333333333302',
        extraPrice: new Decimal(0),
      });
    prisma.topping.findFirst.mockResolvedValue({
      id: '55555555-5555-4555-8555-555555555551',
    });
  }

  function mockSweetCatalog() {
    prisma.sweetType.findFirst.mockResolvedValue({
      id: '44444444-4444-4444-8444-444444444441',
      pricePer100: new Decimal(140),
      flavors: [
        {
          id: '66666666-6666-4666-8666-444441000001',
          sweetTypeId: '44444444-4444-4444-8444-444444444441',
        },
        {
          id: '66666666-6666-4666-8666-444441000002',
          sweetTypeId: '44444444-4444-4444-8444-444444444441',
        },
      ],
    });
  }

  it('blocks order creation when store is closed', async () => {
    settingsService.getSettings.mockResolvedValue({
      storeStatus: StoreStatus.CLOSED,
      whatsappNumber: '5599999999999',
    });

    await expect(
      makeService().createOrder({
        ...validOrderDto(),
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it.each([
    [30, 1],
    [50, 2],
    [100, 4],
  ])('allows %i sweets with max %i flavor(s)', (quantity, maxFlavors) => {
    const service = makeService();

    expect(service['getMaxSweetFlavors'](quantity)).toBe(maxFlavors);
  });

  it('rejects unsupported sweet quantities', () => {
    const service = makeService();

    expect(() => service['getMaxSweetFlavors'](40)).toThrow(BadRequestException);
  });

  it('calculates cake price from size and two filling extras', async () => {
    mockActiveCakeCatalog();

    const result = await makeService()['calculateCake'](validOrderDto().cake);

    expect(result.unitPrice.toNumber()).toBe(170);
    expect(result.fillingExtraPrice.toNumber()).toBe(30);
  });

  it('returns 404 when a cake catalog item is inactive or missing', async () => {
    prisma.dough.findFirst.mockResolvedValue(null);
    prisma.cakeSize.findFirst.mockResolvedValue({ price: new Decimal(140) });
    prisma.filling.findFirst.mockResolvedValue({ extraPrice: new Decimal(0) });
    prisma.topping.findFirst.mockResolvedValue({ id: 'topping' });

    await expect(
      makeService()['calculateCake'](validOrderDto().cake),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('calculates sweet unit and total price using price per 100', async () => {
    mockSweetCatalog();

    const result = await makeService()['calculateSweet'](
      validOrderDto().sweets[0],
    );

    expect(result.unitPrice.toNumber()).toBe(1.4);
    expect(result.totalPrice.toNumber()).toBe(70);
    expect(result.maxFlavors).toBe(2);
  });

  it('rejects sweet flavor selections above the quantity rule', async () => {
    await expect(
      makeService()['calculateSweet']({
        sweetTypeId: '44444444-4444-4444-8444-444444444441',
        quantity: 30,
        sweetFlavorIds: [
          '66666666-6666-4666-8666-444441000001',
          '66666666-6666-4666-8666-444441000002',
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects delivery dates with less than 3 days notice', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    expect(() =>
      makeService()['validateDesiredDate'](tomorrow.toISOString()),
    ).toThrow(BadRequestException);
  });

  it('creates an order with calculated totals and whatsapp link from settings', async () => {
    const dto = validOrderDto();
    settingsService.getSettings.mockResolvedValue({
      storeStatus: StoreStatus.OPEN,
      whatsappNumber: '5511999999999',
    });
    customersService.upsertFromContact.mockResolvedValue({ id: 'customer-id' });
    customersService.toContactSnapshot.mockReturnValue({
      name: dto.customerName,
      phone: dto.customerPhone,
      email: null,
      address: null,
    });
    prisma.order.findUnique.mockResolvedValue(null);
    mockActiveCakeCatalog();
    mockSweetCatalog();
    prisma.order.create.mockResolvedValue({
      id: 'order-id',
      orderCode: 'AMC-20300110-1234',
      status: 'NEW',
      totalPrice: new Decimal(240),
      depositPrice: new Decimal(120),
      remainingPrice: new Decimal(120),
      desiredDate: new Date(dto.desiredDate),
      items: [
        {
          productType: ProductType.CAKE,
          totalPrice: new Decimal(170),
        },
      ],
    });

    const result = await makeService().createOrder(dto);
    const createArgs = prisma.order.create.mock.calls[0][0];

    expect(createArgs.data.totalPrice.toNumber()).toBe(240);
    expect(createArgs.data.depositPrice.toNumber()).toBe(120);
    expect(createArgs.data.remainingPrice.toNumber()).toBe(120);
    expect(createArgs.data.customerId).toBe('customer-id');
    expect(createArgs.data.contactSnapshot).toEqual({
      name: dto.customerName,
      phone: dto.customerPhone,
      email: null,
      address: null,
    });
    expect(result.whatsapp.number).toBe('5511999999999');
    expect(result.whatsapp.link).toContain('https://wa.me/5511999999999');
  });
});

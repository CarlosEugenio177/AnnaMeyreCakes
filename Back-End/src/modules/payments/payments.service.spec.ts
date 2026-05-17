import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  const tx = {
    paymentRecord: { create: jest.fn(), aggregate: jest.fn() },
    order: { findUnique: jest.fn(), update: jest.fn() },
  };
  const prisma = {
    $transaction: jest.fn((callback: (client: typeof tx) => unknown) =>
      callback(tx),
    ),
  };
  beforeEach(() => {
    jest.clearAllMocks();
    tx.order.findUnique.mockResolvedValue({ depositPrice: new Decimal(120) });
  });

  it('creates a paid payment and moves order to deposit paid when paid total reaches deposit', async () => {
    tx.paymentRecord.create.mockResolvedValue({
      id: 'payment-id',
      status: PaymentStatus.PAID,
    });
    tx.paymentRecord.aggregate.mockResolvedValue({
      _sum: { amount: new Decimal(120) },
    });

    await expect(
      new PaymentsService(prisma as never).createPayment('order-id', {
        amount: 120,
        paymentMethod: PaymentMethod.PIX,
      }),
    ).resolves.toEqual({ id: 'payment-id', status: PaymentStatus.PAID });

    expect(tx.order.update).toHaveBeenCalledWith({
      where: { id: 'order-id' },
      data: { status: OrderStatus.DEPOSIT_PAID },
    });
  });

  it('does not move order status when paid total is below deposit', async () => {
    tx.paymentRecord.create.mockResolvedValue({
      id: 'payment-id',
      status: PaymentStatus.PAID,
    });
    tx.paymentRecord.aggregate.mockResolvedValue({
      _sum: { amount: new Decimal(60) },
    });

    await new PaymentsService(prisma as never).createPayment('order-id', {
      amount: 60,
      paymentMethod: PaymentMethod.PIX,
    });

    expect(tx.order.update).not.toHaveBeenCalled();
  });

  it('does not change order status for pending payments', async () => {
    tx.paymentRecord.create.mockResolvedValue({
      id: 'payment-id',
      status: PaymentStatus.PENDING,
    });

    await new PaymentsService(prisma as never).createPayment('order-id', {
      amount: 120,
      paymentMethod: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,
    });

    expect(tx.order.update).not.toHaveBeenCalled();
  });

  it('returns 404 when order does not exist', async () => {
    tx.order.findUnique.mockResolvedValue(null);

    await expect(
      new PaymentsService(prisma as never).createPayment('order-id', {
        amount: 120,
        paymentMethod: PaymentMethod.PIX,
      }),
    ).rejects.toThrow('Pedido não encontrado');
  });
});

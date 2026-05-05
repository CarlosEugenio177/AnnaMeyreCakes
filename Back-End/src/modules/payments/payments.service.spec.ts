import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  const tx = {
    paymentRecord: { create: jest.fn() },
    order: { update: jest.fn() },
  };
  const prisma = {
    $transaction: jest.fn((callback: (client: typeof tx) => unknown) =>
      callback(tx),
    ),
  };
  const ordersService = {
    ensureOrderExists: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a paid payment and moves order to deposit paid', async () => {
    tx.paymentRecord.create.mockResolvedValue({
      id: 'payment-id',
      status: PaymentStatus.PAID,
    });

    await expect(
      new PaymentsService(
        prisma as never,
        ordersService as never,
      ).createPayment('order-id', {
        amount: 120,
        paymentMethod: PaymentMethod.PIX,
      }),
    ).resolves.toEqual({ id: 'payment-id', status: PaymentStatus.PAID });

    expect(tx.order.update).toHaveBeenCalledWith({
      where: { id: 'order-id' },
      data: { status: OrderStatus.DEPOSIT_PAID },
    });
  });

  it('does not change order status for pending payments', async () => {
    tx.paymentRecord.create.mockResolvedValue({
      id: 'payment-id',
      status: PaymentStatus.PENDING,
    });

    await new PaymentsService(
      prisma as never,
      ordersService as never,
    ).createPayment('order-id', {
      amount: 120,
      paymentMethod: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,
    });

    expect(tx.order.update).not.toHaveBeenCalled();
  });
});

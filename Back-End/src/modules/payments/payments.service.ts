import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { toDecimal } from '../../common/utils/money';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(orderId: string, dto: CreatePaymentDto) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        select: { depositPrice: true },
      });

      if (!order) {
        throw new NotFoundException('Pedido não encontrado');
      }

      const payment = await tx.paymentRecord.create({
        data: {
          orderId,
          amount: toDecimal(dto.amount).toDecimalPlaces(2),
          paymentMethod: dto.paymentMethod,
          status: dto.status ?? PaymentStatus.PAID,
          paidAt:
            dto.paidAt !== undefined
              ? new Date(dto.paidAt)
              : dto.status === PaymentStatus.PENDING
                ? null
                : new Date(),
        },
      });

      if (payment.status === PaymentStatus.PAID) {
        const paidPayments = await tx.paymentRecord.aggregate({
          where: { orderId, status: PaymentStatus.PAID },
          _sum: { amount: true },
        });
        const paidAmount = paidPayments._sum.amount ?? toDecimal(0);

        if (paidAmount.greaterThanOrEqualTo(order.depositPrice)) {
          await tx.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.DEPOSIT_PAID },
          });
        }
      }

      return payment;
    });
  }
}

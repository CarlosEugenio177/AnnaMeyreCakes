import { Injectable } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { toDecimal } from '../../common/utils/money';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
  ) {}

  async createPayment(orderId: string, dto: CreatePaymentDto) {
    await this.ordersService.ensureOrderExists(orderId);

    return this.prisma.$transaction(async (tx) => {
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
        await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.DEPOSIT_PAID },
        });
      }

      return payment;
    });
  }
}

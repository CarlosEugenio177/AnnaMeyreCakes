import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('admin/orders/:id/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.ADMIN)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  createPayment(@Param('id') orderId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(orderId, dto);
  }
}

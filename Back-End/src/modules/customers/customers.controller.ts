import { Controller, Delete, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { Request, Response } from 'express';
import { CurrentCustomer } from '../../common/decorators/current-customer.decorator';
import { CustomerSessionGuard } from '../../common/guards/customer-session.guard';
import { CustomersService } from './customers.service';

@Controller('customer')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('me')
  @UseGuards(CustomerSessionGuard)
  getMe(@CurrentCustomer() customer: Customer) {
    return {
      customer: this.customersService.getProfile(customer),
    };
  }

  @Delete('session')
  @UseGuards(CustomerSessionGuard)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.customersService.revokeCurrentSession(request);
    this.customersService.clearSessionCookie(response);
    return { success: true };
  }

  @Get('orders')
  @UseGuards(CustomerSessionGuard)
  getOrders(@CurrentCustomer() customer: Customer) {
    return this.customersService.getOrders(customer.id);
  }

  @Get('orders/:id')
  @UseGuards(CustomerSessionGuard)
  getOrder(@CurrentCustomer() customer: Customer, @Param('id') id: string) {
    return this.customersService.getOrder(customer.id, id);
  }

  @Get('orders/:id/reorder')
  @UseGuards(CustomerSessionGuard)
  getReorderPayload(@CurrentCustomer() customer: Customer, @Param('id') id: string) {
    return this.customersService.getReorderPayload(customer.id, id);
  }
}

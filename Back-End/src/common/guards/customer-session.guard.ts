import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { Request } from 'express';
import { CustomersService } from '../../modules/customers/customers.service';

type CustomerRequest = Request & {
  customer?: Customer;
};

@Injectable()
export class CustomerSessionGuard implements CanActivate {
  constructor(private readonly customersService: CustomersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomerRequest>();
    const token = this.customersService.readSessionToken(request.headers.cookie);

    if (!token) {
      throw new UnauthorizedException('Sessao de cliente nao encontrada');
    }

    const customer = await this.customersService.findCustomerBySessionToken(token);

    if (!customer) {
      throw new UnauthorizedException('Sessao de cliente invalida');
    }

    request.customer = customer;
    return true;
  }
}

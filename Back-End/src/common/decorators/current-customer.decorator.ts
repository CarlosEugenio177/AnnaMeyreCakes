import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Customer } from '@prisma/client';

export const CurrentCustomer = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Customer => {
    const request = context.switchToHttp().getRequest<{ customer: Customer }>();
    return request.customer;
  },
);

import { Module } from '@nestjs/common';
import { CustomerSessionGuard } from '../../common/guards/customer-session.guard';
import { ApiCustomersController, CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';

@Module({
  controllers: [CustomersController, ApiCustomersController],
  providers: [CustomersService, CustomerSessionGuard],
  exports: [CustomersService],
})
export class CustomersModule {}

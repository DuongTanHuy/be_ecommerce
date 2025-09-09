import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import OrderRepository from 'src/routes/order/order.repo'

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository]
})
export class OrderModule {}

import { Injectable } from '@nestjs/common'
import { CreateOrderBodyType, GetOrderListQueryType } from 'src/routes/order/entities/order.entity'
import OrderRepository from 'src/routes/order/order.repo'

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  create(userId: number, createOrderDto: CreateOrderBodyType) {
    return this.orderRepository.create(userId, createOrderDto)
  }

  findAll(userId: number, query: GetOrderListQueryType) {
    return this.orderRepository.list(userId, query)
  }

  findOne(userId: number, orderId: number) {
    return this.orderRepository.detail(userId, orderId)
  }

  cancel(userId: number, orderId: number) {
    return this.orderRepository.cancel(userId, orderId)
  }
}

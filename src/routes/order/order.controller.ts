import { Controller, Get, Post, Body, Param, Query, Put } from '@nestjs/common'
import { OrderService } from './order.service'
import {
  CancelOrderResDto,
  CreateOrderBodyDto,
  CreateOrderResDto,
  GetOrderDetailResDto,
  GetOrderListQueryDto,
  GetOrderListResDto,
  GetOrderParamsDto
} from './dto/create-order.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ZodSerializerDto(CreateOrderResDto)
  create(@Body() createOrderDto: CreateOrderBodyDto, @ActiveUser('userId') userId: number) {
    return this.orderService.create(userId, createOrderDto)
  }

  @Get()
  @ZodSerializerDto(GetOrderListResDto)
  findAll(@Query() query: GetOrderListQueryDto, @ActiveUser('userId') userId: number) {
    return this.orderService.findAll(userId, query)
  }

  @Get(':orderId')
  @ZodSerializerDto(GetOrderDetailResDto)
  findOne(@Param() params: GetOrderParamsDto, @ActiveUser('userId') userId: number) {
    return this.orderService.findOne(userId, params.orderId)
  }

  @Put(':orderId')
  @ZodSerializerDto(CancelOrderResDto)
  cancel(@Param() params: GetOrderParamsDto, @ActiveUser('userId') userId: number) {
    return this.orderService.cancel(userId, params.orderId)
  }
}

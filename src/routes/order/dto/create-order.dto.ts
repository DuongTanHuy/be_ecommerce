import { createZodDto } from 'nestjs-zod'
import {
  CancelOrderResSchema,
  CreateOrderBodySchema,
  CreateOrderResSchema,
  GetOrderDetailResSchema,
  GetOrderListQuerySchema,
  GetOrderListResSchema,
  GetOrderParamsSchema
} from 'src/routes/order/entities/order.entity'

class GetOrderListResDto extends createZodDto(GetOrderListResSchema) {}

class GetOrderListQueryDto extends createZodDto(GetOrderListQuerySchema) {}

class GetOrderDetailResDto extends createZodDto(GetOrderDetailResSchema) {}

class CreateOrderBodyDto extends createZodDto(CreateOrderBodySchema) {}

class CreateOrderResDto extends createZodDto(CreateOrderResSchema) {}

class CancelOrderResDto extends createZodDto(CancelOrderResSchema) {}

class GetOrderParamsDto extends createZodDto(GetOrderParamsSchema) {}

export {
  GetOrderListResDto,
  GetOrderListQueryDto,
  GetOrderDetailResDto,
  CreateOrderBodyDto,
  CreateOrderResDto,
  CancelOrderResDto,
  GetOrderParamsDto
}

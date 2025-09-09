import { OrderStatus } from 'src/shared/constants/order.constant'
import { PaginationQuerySchema } from 'src/shared/models/request.model'
import z from 'zod'

const OrderStatusSchema = z.enum([
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.PENDING_PICKUP,
  OrderStatus.PENDING_DELIVERY,
  OrderStatus.DELIVERED,
  OrderStatus.RETURNED,
  OrderStatus.CANCELLED
])

const OrderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  status: OrderStatusSchema,
  receiver: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string()
  }),
  shopId: z.number().nullable(),
  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable()
})

const ProductSKUSnapshotSchema = z.object({
  id: z.number(),
  productId: z.number().nullable(),
  productName: z.string(),
  productTranslations: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      languageId: z.string()
    })
  ),
  skuPrice: z.number(),
  image: z.string(),
  skuValue: z.string(),
  skuId: z.number().nullable(),
  orderId: z.number().nullable(),
  quantity: z.number(),
  createdAt: z.date()
})

const GetOrderListResSchema = z.object({
  data: z.array(
    OrderSchema.extend({
      items: z.array(ProductSKUSnapshotSchema)
    }).omit({
      receiver: true,
      deletedAt: true,
      deletedById: true,
      createdById: true,
      updatedById: true
    })
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

const GetOrderListQuerySchema = PaginationQuerySchema.extend({
  status: OrderStatusSchema.optional()
})

const GetOrderDetailResSchema = OrderSchema.extend({
  items: z.array(ProductSKUSnapshotSchema)
})

const CreateOrderBodySchema = z
  .array(
    z.object({
      shopId: z.number(),
      receiver: z.object({
        name: z.string(),
        phone: z.string(),
        address: z.string()
      }),
      cartItemIds: z.array(z.number()).min(1)
    })
  )
  .min(1)

const CreateOrderResSchema = z.object({
  data: z.array(OrderSchema)
})

const CancelOrderResSchema = OrderSchema

const GetOrderParamsSchema = z
  .object({
    orderId: z.coerce.number().int().positive()
  })
  .strict()

type OrderStatusType = z.infer<typeof OrderStatusSchema>

type OrderType = z.infer<typeof OrderSchema>

type ProductSKUSnapshotType = z.infer<typeof ProductSKUSnapshotSchema>

type GetOrderListResType = z.infer<typeof GetOrderListResSchema>

type GetOrderListQueryType = z.infer<typeof GetOrderListQuerySchema>

type GetOrderDetailResType = z.infer<typeof GetOrderDetailResSchema>

type CreateOrderBodyType = z.infer<typeof CreateOrderBodySchema>

type CreateOrderResType = z.infer<typeof CreateOrderResSchema>

type CancelOrderResType = z.infer<typeof CancelOrderResSchema>

type GetOrderParamsType = z.infer<typeof GetOrderParamsSchema>

export {
  OrderStatusSchema,
  OrderSchema,
  ProductSKUSnapshotSchema,
  GetOrderListResSchema,
  GetOrderListQuerySchema,
  GetOrderDetailResSchema,
  CreateOrderBodySchema,
  CreateOrderResSchema,
  CancelOrderResSchema,
  GetOrderParamsSchema,
  OrderStatusType,
  OrderType,
  ProductSKUSnapshotType,
  GetOrderListResType,
  GetOrderListQueryType,
  GetOrderDetailResType,
  CreateOrderBodyType,
  CreateOrderResType,
  CancelOrderResType,
  GetOrderParamsType
}

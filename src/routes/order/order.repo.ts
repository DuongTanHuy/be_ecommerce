import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  CancelOrderResType,
  CreateOrderBodyType,
  CreateOrderResType,
  GetOrderDetailResType,
  GetOrderListQueryType,
  GetOrderListResType
} from 'src/routes/order/entities/order.entity'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { NotFoundRecordException } from 'src/shared/error'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class OrderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(userId: number, { page, limit, status }: GetOrderListQueryType): Promise<GetOrderListResType> {
    const take = limit ?? 10
    const skip = page ? (page - 1) * limit : 0
    const where: Prisma.OrderWhereInput = {
      userId,
      status
    }

    const totalItems$ = this.prismaService.order.count({
      where
    })

    const data$ = this.prismaService.order.findMany({
      where,
      include: {
        items: true
      },
      take,
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const [data, totalItems] = await Promise.all([data$, totalItems$])

    return {
      data,
      totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit)
    }
  }

  async create(userId: number, data: CreateOrderBodyType): Promise<CreateOrderResType> {
    const allBodyCartItemIds = data.map((item) => item.cartItemIds).flat()
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        id: {
          in: allBodyCartItemIds
        },
        userId
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: true
              }
            }
          }
        }
      }
    })

    // 1. Kiểm tra  tất cả cartItemIds có tồn tại trong db không
    if (allBodyCartItemIds.length !== cartItems.length) {
      throw NotFoundRecordException
    }

    // 2. Kiểm tra số lượng mua có lớn hơn số lượng tồn kho không
    const isOutOfStock = cartItems.some((item) => {
      return item.sku.stock < item.quantity
    })

    if (isOutOfStock) {
      throw new BadRequestException('Out of stock')
    }

    // 3. Kiểm tra tất cả sản phẩm mua có sản phầm nào bị xóa không
    const isExistNotReadyProduct = cartItems.some(
      (item) =>
        item.sku.product.deletedAt !== null ||
        item.sku.product.publishedAt === null ||
        item.sku.product.publishedAt > new Date()
    )

    if (isExistNotReadyProduct) {
      throw NotFoundRecordException
    }

    // 4. Kiểm tra các skuId trong cartItem gửi lên có thuộc về shopId gửi lên không
    const cartItemMap = new Map<number, (typeof cartItems)[0]>()
    cartItems.forEach((item) => {
      cartItemMap.set(item.id, item)
    })
    const isValidShop = data.every((item) => {
      const dataCartItemIds = item.cartItemIds

      return dataCartItemIds.every((cartItemId) => {
        const cartItem = cartItemMap.get(cartItemId)!
        return item.shopId === cartItem.sku.createdById
      })
    })

    if (!isValidShop) {
      throw NotFoundRecordException
    }

    // 5. Tạo order
    // 6. Xóa cartItem

    const orders = await this.prismaService.$transaction(async (tx) => {
      const orders = await Promise.all(
        data.map((item) =>
          tx.order.create({
            data: {
              userId,
              status: OrderStatus.PENDING_PAYMENT,
              receiver: item.receiver,
              createdById: userId,
              shopId: item.shopId,
              items: {
                create: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!
                  return {
                    productName: cartItem.sku.product.name,
                    skuPrice: cartItem.sku.price,
                    image: cartItem.sku.image,
                    skuId: cartItem.sku.id,
                    skuValue: cartItem.sku.value,
                    quantity: cartItem.quantity,
                    productId: cartItem.sku.product.id,
                    productTranslations: cartItem.sku.product.productTranslations.map((translation) => {
                      return {
                        id: translation.id,
                        name: translation.name,
                        description: translation.description,
                        languageId: translation.languageId
                      }
                    })
                  }
                })
              },
              products: {
                connect: item.cartItemIds.map((cartItemId) => {
                  const cartItem = cartItemMap.get(cartItemId)!
                  return {
                    id: cartItem.sku.product.id
                  }
                })
              }
            }
          })
        )
      )
      await tx.cartItem.deleteMany({
        where: {
          id: {
            in: allBodyCartItemIds
          }
        }
      })

      return orders
    })

    return {
      data: orders
    }
  }

  detail(userId: number, orderId: number): Promise<GetOrderDetailResType | null> {
    return this.prismaService.order.findUnique({
      where: {
        id: orderId,
        userId,
        deletedAt: null
      },
      include: {
        items: true
      }
    })
  }

  async cancel(userId: number, orderId: number): Promise<CancelOrderResType> {
    const order = await this.prismaService.order.findFirstOrThrow({
      where: {
        id: orderId,
        userId,
        deletedAt: null
      }
    })

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new BadRequestException("Can't cancel this order")
    }

    return this.prismaService.order.update({
      where: {
        id: orderId,
        userId,
        deletedAt: null
      },
      data: {
        status: OrderStatus.CANCELLED,
        updatedById: userId
      }
    })
  }
}

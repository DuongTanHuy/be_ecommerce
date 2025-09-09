import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  AddToCartBodyType,
  CartItemDetailResType,
  CartItemType,
  DeleteCartBodyType,
  GetCartResType,
  UpdateCartItemBodyType
} from 'src/routes/cart/entities/cart.entity'
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/other.constant'
import { NotFoundRecordException } from 'src/shared/error'
import { PaginationQueryType } from 'src/shared/models/request.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class CartRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private async validateSku(skuId: number, quantity: number) {
    const sku = await this.prismaService.sKU.findUnique({
      where: {
        id: skuId,
        deletedAt: null
      },
      include: {
        product: true
      }
    })

    if (!sku) {
      throw NotFoundRecordException
    }

    if (sku.stock < 1 || quantity > sku.stock) {
      throw new BadRequestException('Out of stock')
    }

    const { product } = sku

    if (
      product.deletedAt !== null ||
      product.publishedAt === null ||
      (product.publishedAt !== null && product.publishedAt > new Date())
    ) {
      throw NotFoundRecordException
    }

    return sku
  }

  async findAll({ page, limit }: PaginationQueryType, userId: number, languageId?: string): Promise<GetCartResType> {
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        userId,
        sku: {
          product: {
            deletedAt: null,
            publishedAt: {
              lte: new Date(),
              not: null
            }
          }
        }
      },
      include: {
        sku: {
          include: {
            product: {
              include: {
                productTranslations: {
                  where: {
                    deletedAt: null,
                    ...(languageId !== ALL_LANGUAGE_CODE && {
                      languageId
                    })
                  }
                },
                createdBy: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const groupMap = new Map<number, CartItemDetailResType>()

    for (const cartItem of cartItems) {
      const shopId = cartItem.sku.product.createdById

      if (shopId) {
        if (!groupMap.has(shopId)) {
          groupMap.set(shopId, {
            shop: cartItem.sku.product.createdBy,
            cartItems: []
          })
        }
        groupMap.get(shopId)?.cartItems.push(cartItem)
      }
    }

    const sortedGroups = Array.from(groupMap.values())

    const take = limit ?? 10
    const skip = page ? (page - 1) * limit : 0

    const totalGroups = sortedGroups.length
    const pagedGroups = sortedGroups.slice(skip, skip + take)

    return {
      data: pagedGroups,
      totalItem: totalGroups,
      page: page ?? 1,
      limit: take,
      pageTotal: Math.ceil(totalGroups / take)
    }
  }

  async findAllV2({ page, limit }: PaginationQueryType, userId: number, languageId?: string): Promise<GetCartResType> {
    const take = limit ?? 10
    const skip = page ? (page - 1) * limit : 0
    // Đếm tổng số nhóm sản phẩm
    const totalItems$ = this.prismaService.$queryRaw<{ createdById: number }[]>`
      SELECT
        "Product"."createdById"
      FROM "CartItem"
      JOIN "SKU" ON "CartItem"."skuId" = "SKU"."id"
      JOIN "Product" ON "SKU"."productId" = "Product"."id"
      WHERE "CartItem"."userId" = ${userId}
        AND "Product"."deletedAt" IS NULL
        AND "Product"."publishedAt" IS NOT NULL
        AND "Product"."publishedAt" <= NOW()
      GROUP BY "Product"."createdById"
    `
    const data$ = await this.prismaService.$queryRaw<CartItemDetailResType[]>`
     SELECT
       "Product"."createdById",
       json_agg(
         jsonb_build_object(
           'id', "CartItem"."id",
           'quantity', "CartItem"."quantity",
           'skuId', "CartItem"."skuId",
           'userId', "CartItem"."userId",
           'createdAt', "CartItem"."createdAt",
           'updatedAt', "CartItem"."updatedAt",
           'sku', jsonb_build_object(
             'id', "SKU"."id",
              'value', "SKU"."value",
              'price', "SKU"."price",
              'stock', "SKU"."stock",
              'image', "SKU"."image",
              'productId', "SKU"."productId",
              'product', jsonb_build_object(
                'id', "Product"."id",
                'publishedAt', "Product"."publishedAt",
                'name', "Product"."name",
                'basePrice', "Product"."basePrice",
                'virtualPrice', "Product"."virtualPrice",
                'brandId', "Product"."brandId",
                'images', "Product"."images",
                'variants', "Product"."variants",
                'productTranslations', COALESCE((
                  SELECT json_agg(
                    jsonb_build_object(
                      'id', pt."id",
                      'productId', pt."productId",
                      'languageId', pt."languageId",
                      'name', pt."name",
                      'description', pt."description"
                    )
                  ) FILTER (WHERE pt."id" IS NOT NULL)
                  FROM "ProductTranslation" pt
                  WHERE pt."productId" = "Product"."id"
                    AND pt."deletedAt" IS NULL
                    ${languageId === ALL_LANGUAGE_CODE ? Prisma.sql`` : Prisma.sql`AND pt."languageId" = ${languageId}`}
                ), '[]'::json)
              )
           )
         ) ORDER BY "CartItem"."updatedAt" DESC
       ) AS "cartItems",
       jsonb_build_object(
         'id', "User"."id",
         'name', "User"."name",
         'avatar', "User"."avatar"
       ) AS "shop"
     FROM "CartItem"
     JOIN "SKU" ON "CartItem"."skuId" = "SKU"."id"
     JOIN "Product" ON "SKU"."productId" = "Product"."id"
     LEFT JOIN "ProductTranslation" ON "Product"."id" = "ProductTranslation"."productId"
       AND "ProductTranslation"."deletedAt" IS NULL
       ${languageId === ALL_LANGUAGE_CODE ? Prisma.sql`` : Prisma.sql`AND "ProductTranslation"."languageId" = ${languageId}`}
     LEFT JOIN "User" ON "Product"."createdById" = "User"."id"
     WHERE "CartItem"."userId" = ${userId}
        AND "Product"."deletedAt" IS NULL
        AND "Product"."publishedAt" IS NOT NULL
        AND "Product"."publishedAt" <= NOW()
     GROUP BY "Product"."createdById", "User"."id"
     ORDER BY MAX("CartItem"."updatedAt") DESC
      LIMIT ${take} 
      OFFSET ${skip}
   `
    const [data, totalItems] = await Promise.all([data$, totalItems$])

    return {
      data,
      page,
      limit,
      totalItem: totalItems.length,
      pageTotal: Math.ceil(totalItems.length / limit)
    }
  }

  async create(
    data: AddToCartBodyType & {
      userId: number
    }
  ): Promise<CartItemType> {
    await this.validateSku(data.skuId, data.quantity)

    return this.prismaService.cartItem.upsert({
      where: {
        userId_skuId: {
          userId: data.userId,
          skuId: data.skuId
        }
      },
      update: {
        quantity: {
          increment: data.quantity
        }
      },
      create: data
    })
  }

  async update(id: number, data: UpdateCartItemBodyType): Promise<CartItemType> {
    await this.validateSku(data.skuId, data.quantity)

    return this.prismaService.cartItem.update({
      where: {
        id
      },
      data
    })
  }

  delete(userId: number, body: DeleteCartBodyType): Promise<{ count: number }> {
    return this.prismaService.cartItem.deleteMany({
      where: {
        id: {
          in: body.cartItemIds
        },
        userId
      }
    })
  }
}

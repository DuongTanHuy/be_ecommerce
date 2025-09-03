import { Injectable } from '@nestjs/common'
import {
  GetProductDetailResType,
  GetProductsQueryType,
  GetProductsResType,
  ProductType
} from 'src/routes/product/entities/product.entity'
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/other.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(query: GetProductsQueryType, languageId?: string): Promise<GetProductsResType> {
    const take = query?.limit ?? 10
    const skip = query?.page ? (query.page - 1) * take : 0

    const [total, products] = await Promise.all([
      this.prismaService.product.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.product.findMany({
        where: {
          deletedAt: null
        },
        include: {
          productTranslations: {
            where: {
              deletedAt: null,
              ...(languageId !== ALL_LANGUAGE_CODE && {
                languageId
              })
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take,
        skip
      })
    ])

    return {
      total,
      products,
      page: query?.page ?? 1,
      limit: query?.limit ?? 10,
      totalPage: Math.ceil(total / (query?.limit ?? 10))
    }
  }

  findById(id: number, languageId?: string): Promise<GetProductDetailResType | null> {
    return this.prismaService.product.findUnique({
      where: {
        id,
        deletedAt: null
      },
      include: {
        productTranslations: {
          where: {
            deletedAt: null,
            ...(languageId !== ALL_LANGUAGE_CODE && {
              languageId
            })
          }
        },
        skus: {
          where: {
            deletedAt: null
          }
        },
        categories: {
          where: {
            deletedAt: null
          },
          include: {
            categoryTranslations: {
              where: {
                deletedAt: null,
                ...(languageId !== ALL_LANGUAGE_CODE && {
                  languageId
                })
              }
            }
          }
        },
        brand: {
          include: {
            brandTranslations: {
              where: {
                deletedAt: null,
                ...(languageId !== ALL_LANGUAGE_CODE && {
                  languageId
                })
              }
            }
          }
        }
      }
    })
  }

  async delete(id: number, userId: number, isHard: boolean = false): Promise<ProductType> {
    if (isHard) {
      const [product] = await Promise.all([
        this.prismaService.product.delete({
          where: {
            id
          }
        }),
        this.prismaService.sKU.deleteMany({
          where: {
            productId: id
          }
        })
      ])

      return product
    }

    const [product] = await Promise.all([
      this.prismaService.product.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date(),
          deletedById: userId
        }
      }),
      this.prismaService.sKU.deleteMany({
        where: {
          productId: id
        }
      })
    ])
    return product
  }
}

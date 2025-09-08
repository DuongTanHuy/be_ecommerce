import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  CreateProductBodyType,
  GetProductDetailResType,
  GetProductsQueryType,
  GetProductsResType,
  ProductType,
  UpdateProductBodyType
} from 'src/routes/product/entities/product.entity'
import { ALL_LANGUAGE_CODE, SortBy } from 'src/shared/constants/other.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list({
    limit,
    page,
    name,
    brandIds,
    categories,
    minPrice,
    maxPrice,
    createdById,
    isPublic,
    languageId,
    orderBy,
    sortBy
  }: GetProductsQueryType & {
    isPublic?: boolean
    languageId?: string
  }): Promise<GetProductsResType> {
    const take = limit ?? 10
    const skip = page ? (page - 1) * take : 0

    let where: Prisma.ProductWhereInput = {
      deletedAt: null,
      createdById: createdById ? createdById : undefined
    }

    if (isPublic) {
      where.publishedAt = {
        lte: new Date(),
        not: null
      }
    } else if (isPublic === false) {
      where = {
        ...where,
        OR: [
          {
            publishedAt: null
          },
          {
            publishedAt: {
              gt: new Date()
            }
          }
        ]
      }
    }

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive'
      }
    }

    if (brandIds && brandIds.length > 0) {
      where.brandId = {
        in: brandIds
      }
    }

    if (categories && categories.length > 0) {
      where.categories = {
        some: {
          id: {
            in: categories
          }
        }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {
        gte: minPrice ?? undefined,
        lte: maxPrice ?? undefined
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    let calculatedOrderBy: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[] = {
      createdAt: orderBy
    }
    if (sortBy === SortBy.Price) {
      calculatedOrderBy = {
        basePrice: orderBy
      }
    } else if (sortBy === SortBy.Sale) {
      calculatedOrderBy = {
        orders: {
          _count: orderBy
        }
      }
    }

    const [total, products] = await Promise.all([
      this.prismaService.product.count({
        where
      }),
      this.prismaService.product.findMany({
        where,
        include: {
          productTranslations: {
            where: {
              deletedAt: null,
              ...(languageId !== ALL_LANGUAGE_CODE && {
                languageId
              })
            }
          },
          orders: {
            where: {
              deletedAt: null,
              status: 'DELIVERED'
            }
          }
        },
        orderBy: calculatedOrderBy,
        take,
        skip
      })
    ])

    return {
      total,
      products,
      page: page ?? 1,
      limit: limit ?? 10,
      totalPage: Math.ceil(total / (limit ?? 10))
    }
  }

  findById(id: number): Promise<ProductType | null> {
    return this.prismaService.product.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  getDetail({
    productId,
    languageId,
    isPublic
  }: {
    productId: number
    languageId?: string
    isPublic?: boolean
  }): Promise<GetProductDetailResType | null> {
    let where: Prisma.ProductWhereUniqueInput = {
      id: productId,
      deletedAt: null
    }

    if (isPublic) {
      where.publishedAt = {
        lte: new Date(),
        not: null
      }
    } else if (isPublic === false) {
      where = {
        ...where,
        OR: [
          {
            publishedAt: null
          },
          {
            publishedAt: {
              gt: new Date()
            }
          }
        ]
      }
    }

    return this.prismaService.product.findUnique({
      where,
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

  create(
    data: CreateProductBodyType & {
      createdById: number
    }
  ): Promise<GetProductDetailResType> {
    const { skus, categories, ...productData } = data

    return this.prismaService.product.create({
      data: {
        ...productData,
        categories: {
          connect: categories.map((category) => ({
            id: category
          }))
        },
        skus: {
          createMany: {
            data: skus.map((sku) => ({
              ...sku,
              createdById: data.createdById
            }))
          }
        }
      },
      include: {
        productTranslations: {
          where: {
            deletedAt: null
          }
        },
        skus: {
          where: {
            deletedAt: null
          }
        },
        brand: {
          include: {
            brandTranslations: {
              where: {
                deletedAt: null
              }
            }
          }
        },
        categories: {
          where: {
            deletedAt: null
          },
          include: {
            categoryTranslations: {
              where: {
                deletedAt: null
              }
            }
          }
        }
      }
    })
  }

  async update(
    id: number,
    data: UpdateProductBodyType & {
      updatedById: number
    }
  ): Promise<GetProductDetailResType> {
    const { skus: skusData, categories, ...productData } = data

    const existSkus = await this.prismaService.sKU.findMany({
      where: {
        productId: id,
        deletedAt: null
      }
    })

    // SKU đã tồn tại trong db nhưng không có trong data payload thì sẽ bị xóa
    const skusToDelete = existSkus.filter((sku) => skusData.every((s) => s.value !== sku.value))
    const skuIdsToDelete = skusToDelete.map((skuToDelete) => skuToDelete.id)

    // SKU có id thì cập nhật còn không có id thì tạo mới

    const skusWithId = skusData.map((skuData) => {
      const existSku = existSkus.find((existSku) => existSku.value === skuData.value)

      return {
        ...skuData,
        id: existSku ? existSku.id : null
      }
    })

    // SKU đã tồn tại trong db nhưng có trong data payload thì sẽ được cập nhật
    const skusToUpdate = skusWithId.filter((skuWidthId) => skuWidthId.id !== null)

    // SKU không tồn tại trong db nhưng có trong data payload thì sẽ được thêm mới
    const skusToCreate = skusWithId
      .filter((skuWidthId) => skuWidthId.id === null)
      .map((sku) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: skuId, ...skuData } = sku
        return {
          ...skuData,
          productId: id,
          createdById: productData.updatedById
        }
      })

    // Trong trường hợp sử dụng nhiều câu lệnh để thay đổi db liên tiếp (nếu một trong các câu lệnh bị lỗi thì không thể sửa lại data đã thay đổi) nên sử dụng transaction để gom các câu lệnh lại (nếu một lệnh nào đó bị lỗi thì nó sẽ hủy các thay đổi trước đó)
    const [product] = await this.prismaService.$transaction([
      this.prismaService.product.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...productData,
          categories: {
            connect: categories.map((category) => ({
              id: category
            }))
          }
        },
        include: {
          productTranslations: {
            where: {
              deletedAt: null
            }
          },
          skus: {
            where: {
              deletedAt: null
            }
          },
          brand: {
            include: {
              brandTranslations: {
                where: {
                  deletedAt: null
                }
              }
            }
          },
          categories: {
            where: {
              deletedAt: null
            },
            include: {
              categoryTranslations: {
                where: {
                  deletedAt: null
                }
              }
            }
          }
        }
      }),
      this.prismaService.sKU.updateMany({
        where: {
          id: {
            in: skuIdsToDelete
          }
        },
        data: {
          deletedAt: new Date(),
          deletedById: productData.updatedById
        }
      }),
      ...skusToUpdate.map(({ id, ...skuToUpdate }) =>
        this.prismaService.sKU.update({
          where: {
            id: id as number
          },
          data: {
            ...skuToUpdate,
            updatedById: productData.updatedById
          }
        })
      ),
      this.prismaService.sKU.createMany({
        data: skusToCreate.map((skuToCreate) => ({
          ...skuToCreate,
          updatedById: productData.updatedById
        }))
      })
    ])

    return product
  }

  async delete(id: number, userId: number, isHard: boolean = false): Promise<ProductType> {
    if (isHard) {
      return this.prismaService.product.delete({
        where: {
          id
        }
      })
    }

    const currentTime = new Date()

    const [product] = await Promise.all([
      this.prismaService.product.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          deletedAt: currentTime,
          deletedById: userId
        }
      }),
      this.prismaService.productTranslation.updateMany({
        where: {
          productId: id,
          deletedAt: null
        },
        data: {
          deletedAt: currentTime,
          deletedById: userId
        }
      }),
      this.prismaService.sKU.updateMany({
        where: {
          productId: id,
          deletedAt: null
        },
        data: {
          deletedAt: currentTime,
          deletedById: userId
        }
      })
    ])
    return product
  }
}

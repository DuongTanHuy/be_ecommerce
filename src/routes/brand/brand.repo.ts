import { Injectable } from '@nestjs/common'
import { CreateBrandBodyDto } from 'src/routes/brand/dto/create-brand.dto'
import {
  BrandType,
  GetBrandQueryType,
  GetBrandResType,
  UpdateBrandBodyType
} from 'src/routes/brand/entities/brand.entity'
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/other.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll({ page, limit }: GetBrandQueryType, languageId?: string): Promise<GetBrandResType> {
    const take = limit ? limit : 10
    const skip = page ? (page - 1) * limit : 0

    const [total, brands] = await Promise.all([
      this.prismaService.brand.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.brand.findMany({
        where: {
          deletedAt: null
        },
        include: {
          brandTranslations: {
            where: {
              deletedAt: null,
              ...(languageId !== ALL_LANGUAGE_CODE && {
                languageId
              })
            }
          }
        },
        take,
        skip
      })
    ])

    return {
      brands,
      total,
      page: Math.ceil(total / take),
      limit: page || 1,
      totalPages: Math.ceil(total / take)
    }
  }

  create(data: CreateBrandBodyDto & { createdById: number }): Promise<BrandType> {
    return this.prismaService.brand.create({
      data,
      include: {
        brandTranslations: {
          where: {
            deletedAt: null
          }
        }
      }
    })
  }

  findOne(id: number, languageId?: string): Promise<BrandType | null> {
    return this.prismaService.brand.findUnique({
      where: {
        id,
        deletedAt: null
      },
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
    })
  }

  update(id: number, data: UpdateBrandBodyType & { updatedById: number }): Promise<BrandType> {
    return this.prismaService.brand.update({
      where: {
        id,
        deletedAt: null
      },
      data,
      include: {
        brandTranslations: {
          where: {
            deletedAt: null
          }
        }
      }
    })
  }

  delete(id: number, userId: number, isHard: boolean = false) {
    return isHard
      ? this.prismaService.brand.delete({
          where: {
            id
          }
        })
      : this.prismaService.brand.update({
          where: {
            id,
            deletedAt: null
          },
          data: {
            deletedAt: new Date(),
            deletedById: userId
          }
        })
  }
}

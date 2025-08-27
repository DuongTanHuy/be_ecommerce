import { Injectable } from '@nestjs/common'
import {
  CreateCategoryBodyType,
  GetAllCategoriesType,
  GetCategoryDetailResType,
  UpdateCategoryBodyType
} from 'src/routes/category/entities/category.entity'
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/other.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateCategoryBodyType & { createdById: number }): Promise<GetCategoryDetailResType> {
    return this.prismaService.category.create({
      data,
      include: {
        categoryTranslations: {
          where: {
            deletedAt: null
          }
        }
      }
    })
  }

  async findAll(parentCategoryId?: number, languageId?: string): Promise<GetAllCategoriesType> {
    const [total, categories] = await Promise.all([
      this.prismaService.category.count({
        where: {
          parentCategoryId: parentCategoryId ?? null,
          deletedAt: null
        }
      }),
      this.prismaService.category.findMany({
        where: {
          parentCategoryId: parentCategoryId ?? null,
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
      })
    ])

    return {
      categories,
      total
    }
  }

  findOne(id: number, languageId?: string): Promise<GetCategoryDetailResType | null> {
    return this.prismaService.category.findUnique({
      where: {
        id,
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
    })
  }

  update(
    id: number,
    data: UpdateCategoryBodyType & {
      updatedById: number
    }
  ): Promise<GetCategoryDetailResType> {
    return this.prismaService.category.update({
      where: {
        id,
        deletedAt: null
      },
      data,
      include: {
        categoryTranslations: {
          where: {
            deletedAt: null
          }
        }
      }
    })
  }

  delete(id: number, userId: number, isHard: boolean = false) {
    return isHard
      ? this.prismaService.category.delete({
          where: {
            id
          }
        })
      : this.prismaService.category.update({
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

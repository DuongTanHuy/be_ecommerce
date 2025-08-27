import { Injectable } from '@nestjs/common'
import {
  CreateCategoryTranslationBodyType,
  GetCategoryTranslationDetailResType,
  UpdateCategoryTranslationBodyType
} from 'src/routes/category-translation/entities/category-translation.entity'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class CategoryTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    data: CreateCategoryTranslationBodyType & {
      createdById: number
    }
  ): Promise<GetCategoryTranslationDetailResType> {
    return this.prismaService.categoryTranslation.create({
      data
    })
  }

  findOne(id: number) {
    return this.prismaService.categoryTranslation.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  update(
    id: number,
    data: UpdateCategoryTranslationBodyType & {
      updatedById: number
    }
  ) {
    return this.prismaService.categoryTranslation.update({
      where: {
        id,
        deletedAt: null
      },
      data
    })
  }

  delete(id: number, userId: number, isHard: boolean = false) {
    return isHard
      ? this.prismaService.categoryTranslation.delete({
          where: {
            id
          }
        })
      : this.prismaService.categoryTranslation.update({
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

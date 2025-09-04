import { Injectable } from '@nestjs/common'
import {
  CreateProductTranslationBodyType,
  GetProductTranslationDetailResType,
  UpdateProductTranslationBodyType
} from 'src/routes/product-translation/entities/product-translation.entity'
import { ProductTranslationType } from 'src/shared/models/shared-product-translation.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class ProductTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: number): Promise<GetProductTranslationDetailResType | null> {
    return this.prismaService.productTranslation.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  create(
    data: CreateProductTranslationBodyType & {
      createdById: number
    }
  ): Promise<ProductTranslationType> {
    return this.prismaService.productTranslation.create({
      data
    })
  }

  update(
    id: number,
    data: UpdateProductTranslationBodyType & {
      updatedById: number
    }
  ): Promise<ProductTranslationType> {
    return this.prismaService.productTranslation.update({
      where: {
        id,
        deletedAt: null
      },
      data
    })
  }

  delete(id: number, userId: number, isHard: boolean = false) {
    return isHard
      ? this.prismaService.productTranslation.delete({
          where: {
            id
          }
        })
      : this.prismaService.productTranslation.update({
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

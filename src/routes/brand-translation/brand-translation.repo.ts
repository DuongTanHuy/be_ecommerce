import { Injectable } from '@nestjs/common'
import {
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType
} from 'src/routes/brand-translation/entities/brand-translation.entity'
import { BrandTranslationType } from 'src/shared/models/shared-brand-translation.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export default class BrandTranslationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    data: CreateBrandTranslationBodyType & {
      createdById: number
    }
  ): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.create({
      data
    })
  }

  findOne(id: number): Promise<BrandTranslationType | null> {
    return this.prismaService.brandTranslation.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  update(
    id: number,
    data: UpdateBrandTranslationBodyType & {
      updatedById: number
    }
  ): Promise<BrandTranslationType> {
    return this.prismaService.brandTranslation.update({
      where: {
        id,
        deletedAt: null
      },
      data
    })
  }

  delete(id: number, userId: number, isHard: boolean = false) {
    return isHard
      ? this.prismaService.brandTranslation.delete({
          where: {
            id
          }
        })
      : this.prismaService.brandTranslation.update({
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

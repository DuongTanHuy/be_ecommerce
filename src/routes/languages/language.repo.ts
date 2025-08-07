import { Injectable } from '@nestjs/common'
import {
  CreateLanguageBodyType,
  LanguageType,
  UpdateLanguageBodyType
} from 'src/routes/languages/entities/language.entity'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class LanguageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createLanguage(data: CreateLanguageBodyType & { createdById: number }): Promise<LanguageType> {
    return this.prismaService.language.create({
      data
    })
  }

  getAllLanguage(): Promise<LanguageType[]> {
    return this.prismaService.language.findMany({
      where: {
        deletedAt: null
      }
    })
  }

  getDetailLanguage(id: string) {
    return this.prismaService.language.findUnique({
      where: {
        id
      }
    })
  }

  findUnique(id: string): Promise<LanguageType | null> {
    return this.prismaService.language.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  updateLanguage(
    id: string,
    data: UpdateLanguageBodyType & {
      updatedById: number
    }
  ): Promise<LanguageType> {
    return this.prismaService.language.update({
      where: {
        id,
        deletedAt: null
      },
      data
    })
  }

  deleteLanguage(id: string, isHard?: boolean): Promise<LanguageType> {
    return isHard
      ? this.prismaService.language.delete({
          where: {
            id
          }
        })
      : this.prismaService.language.update({
          where: {
            id,
            deletedAt: null
          },
          data: {
            deletedAt: new Date()
          }
        })
  }
}

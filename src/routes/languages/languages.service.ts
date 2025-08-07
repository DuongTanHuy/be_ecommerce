import { Injectable } from '@nestjs/common'
import { LanguageRepository } from 'src/routes/languages/language.repo'
import { CreateLanguageBodyType, UpdateLanguageBodyType } from 'src/routes/languages/entities/language.entity'
import { LanguageExist, LanguageNotFound } from 'src/routes/languages/language.error'

@Injectable()
export class LanguagesService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async create({ userId, data }: { userId: number; data: CreateLanguageBodyType }) {
    const isExistLanguage = await this.languageRepository.findUnique(data.id)

    if (isExistLanguage) {
      throw LanguageExist
    }

    return this.languageRepository.createLanguage({
      createdById: userId,
      ...data
    })
  }

  async findAll() {
    const result = await this.languageRepository.getAllLanguage()

    return {
      data: result,
      totalItem: result.length
    }
  }

  async findOne(id: string) {
    const result = await this.languageRepository.getDetailLanguage(id)

    if (!result) {
      throw LanguageNotFound
    }
    return result
  }

  async update(id: string, userId: number, updateLanguageBodyDto: UpdateLanguageBodyType) {
    const isExistLanguage = await this.languageRepository.findUnique(id)

    if (!isExistLanguage) {
      throw LanguageNotFound
    }

    return this.languageRepository.updateLanguage(id, {
      ...updateLanguageBodyDto,
      updatedById: userId
    })
  }

  async remove(id: string) {
    await this.languageRepository.deleteLanguage(id, true)

    return { message: 'Language is deleted' }
  }
}

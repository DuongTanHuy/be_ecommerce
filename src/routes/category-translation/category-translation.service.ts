import { Injectable } from '@nestjs/common'
import CategoryTranslationRepository from 'src/routes/category-translation/category-translation.repo'
import {
  CreateCategoryTranslationBodyType,
  UpdateCategoryTranslationBodyType
} from 'src/routes/category-translation/entities/category-translation.entity'

@Injectable()
export class CategoryTranslationService {
  constructor(private readonly categoryTranslationRepository: CategoryTranslationRepository) {}

  create(userId: number, createCategoryTranslationDto: CreateCategoryTranslationBodyType) {
    return this.categoryTranslationRepository.create({
      ...createCategoryTranslationDto,
      createdById: userId
    })
  }

  findOne(id: number) {
    return this.categoryTranslationRepository.findOne(id)
  }

  update(userId: number, id: number, updateCategoryTranslationDto: UpdateCategoryTranslationBodyType) {
    return this.categoryTranslationRepository.update(id, {
      ...updateCategoryTranslationDto,
      updatedById: userId
    })
  }

  async remove(id: number, userId: number) {
    await this.categoryTranslationRepository.delete(id, userId)

    return {
      message: 'Delete category translation successful!'
    }
  }
}

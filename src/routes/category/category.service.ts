import CategoryRepository from 'src/routes/category/category.repo'
import { Injectable } from '@nestjs/common'
import { CreateCategoryBodyType, UpdateCategoryBodyType } from 'src/routes/category/entities/category.entity'
import { I18nContext } from 'nestjs-i18n'

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  create(userId: number, createCategoryDto: CreateCategoryBodyType) {
    return this.categoryRepository.create({
      ...createCategoryDto,
      createdById: userId
    })
  }

  findAll(parentCategoryId?: number) {
    return this.categoryRepository.findAll(parentCategoryId, I18nContext.current()?.lang)
  }

  findOne(id: number) {
    return this.categoryRepository.findOne(id, I18nContext.current()?.lang)
  }

  update(userId: number, id: number, updateCategoryDto: UpdateCategoryBodyType) {
    return this.categoryRepository.update(id, {
      ...updateCategoryDto,
      updatedById: userId
    })
  }

  async remove(id: number, userId: number) {
    await this.categoryRepository.delete(id, userId)

    return {
      message: 'Delete category successful!'
    }
  }
}

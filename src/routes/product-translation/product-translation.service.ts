import { Injectable } from '@nestjs/common'
import {
  CreateProductTranslationBodyType,
  UpdateProductTranslationBodyType
} from 'src/routes/product-translation/entities/product-translation.entity'
import ProductTranslationRepository from 'src/routes/product-translation/product-translation.repo'

@Injectable()
export class ProductTranslationService {
  constructor(private readonly productTranslationRepository: ProductTranslationRepository) {}

  create(userId: number, createProductTranslationDto: CreateProductTranslationBodyType) {
    return this.productTranslationRepository.create({
      ...createProductTranslationDto,
      createdById: userId
    })
  }

  findOne(id: number) {
    return this.productTranslationRepository.findById(id)
  }

  update(id: number, userId: number, updateProductTranslationDto: UpdateProductTranslationBodyType) {
    return this.productTranslationRepository.update(id, {
      ...updateProductTranslationDto,
      updatedById: userId
    })
  }

  remove(id: number, userId: number) {
    return this.productTranslationRepository.delete(id, userId)
  }
}

import { Injectable } from '@nestjs/common'
import {
  CreateProductTranslationBodyType,
  UpdateProductTranslationBodyType
} from 'src/routes/product-translation/entities/product-translation.entity'

@Injectable()
export class ProductTranslationService {
  create(createProductTranslationDto: CreateProductTranslationBodyType) {
    return 'This action adds a new productTranslation'
  }

  findAll() {
    return `This action returns all productTranslation`
  }

  findOne(id: number) {
    return `This action returns a #${id} productTranslation`
  }

  update(id: number, updateProductTranslationDto: UpdateProductTranslationBodyType) {
    return `This action updates a #${id} productTranslation`
  }

  remove(id: number) {
    return `This action removes a #${id} productTranslation`
  }
}

import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import { GetProductsQueryType } from 'src/routes/product/entities/product.entity'
import ProductRepository from 'src/routes/product/product.repo'

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  findAll(query: GetProductsQueryType) {
    return this.productRepository.list({
      ...query,
      isPublic: true,
      languageId: I18nContext.current()?.lang as string
    })
  }

  getDetail(id: number) {
    return this.productRepository.getDetail({
      productId: id,
      languageId: I18nContext.current()?.lang as string,
      isPublic: true
    })
  }
}

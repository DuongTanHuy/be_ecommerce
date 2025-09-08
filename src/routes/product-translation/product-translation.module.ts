import { Module } from '@nestjs/common'
import { ProductTranslationService } from './product-translation.service'
import { ProductTranslationController } from './product-translation.controller'
import ProductTranslationRepository from 'src/routes/product-translation/product-translation.repo'

@Module({
  controllers: [ProductTranslationController],
  providers: [ProductTranslationService, ProductTranslationRepository]
})
export class ProductTranslationModule {}

import { Module } from '@nestjs/common'
import { CategoryTranslationService } from './category-translation.service'
import { CategoryTranslationController } from './category-translation.controller'
import CategoryTranslationRepository from 'src/routes/category-translation/category-translation.repo'

@Module({
  controllers: [CategoryTranslationController],
  providers: [CategoryTranslationService, CategoryTranslationRepository]
})
export class CategoryTranslationModule {}

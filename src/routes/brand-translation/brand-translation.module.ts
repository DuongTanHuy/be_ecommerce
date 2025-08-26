import { Module } from '@nestjs/common'
import { BrandTranslationService } from './brand-translation.service'
import { BrandTranslationController } from './brand-translation.controller'
import BrandTranslationRepository from 'src/routes/brand-translation/brand-translation.repo'

@Module({
  controllers: [BrandTranslationController],
  providers: [BrandTranslationService, BrandTranslationRepository]
})
export class BrandTranslationModule {}

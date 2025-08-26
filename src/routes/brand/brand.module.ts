import { Module } from '@nestjs/common'
import { BrandService } from './brand.service'
import { BrandController } from './brand.controller'
import BrandRepository from 'src/routes/brand/brand.repo'

@Module({
  controllers: [BrandController],
  providers: [BrandService, BrandRepository]
})
export class BrandModule {}

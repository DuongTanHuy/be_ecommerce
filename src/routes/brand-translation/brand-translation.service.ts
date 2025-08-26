import { Injectable } from '@nestjs/common'
import BrandTranslationRepository from 'src/routes/brand-translation/brand-translation.repo'
import {
  CreateBrandTranslationBodyType,
  UpdateBrandTranslationBodyType
} from 'src/routes/brand-translation/entities/brand-translation.entity'

@Injectable()
export class BrandTranslationService {
  constructor(private readonly brandTranslationRepository: BrandTranslationRepository) {}

  create(userId: number, createBrandTranslationDto: CreateBrandTranslationBodyType) {
    return this.brandTranslationRepository.create({
      ...createBrandTranslationDto,
      createdById: userId
    })
  }

  findOne(id: number) {
    return this.brandTranslationRepository.findOne(id)
  }

  update(userId: number, brandTranslationId: number, updateBrandTranslationDto: UpdateBrandTranslationBodyType) {
    return this.brandTranslationRepository.update(brandTranslationId, {
      ...updateBrandTranslationDto,
      updatedById: userId
    })
  }

  async remove(id: number, userId: number) {
    await this.brandTranslationRepository.delete(id, userId)

    return {
      message: 'Delete brand translation successful!'
    }
  }
}

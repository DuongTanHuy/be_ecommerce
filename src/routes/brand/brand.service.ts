import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import BrandRepository from 'src/routes/brand/brand.repo'
import { CreateBrandBodyType, GetBrandQueryType, UpdateBrandBodyType } from 'src/routes/brand/entities/brand.entity'

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository
    // private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  create(userId: number, createBrandDto: CreateBrandBodyType) {
    return this.brandRepository.create({
      ...createBrandDto,
      createdById: userId
    })
  }

  findAll(pagination: GetBrandQueryType) {
    return this.brandRepository.getAll(pagination, I18nContext.current()?.lang)
  }

  findOne(id: number) {
    return this.brandRepository.findOne(id, I18nContext.current()?.lang)
  }

  update(id: number, userId: number, updateBrandDto: UpdateBrandBodyType) {
    return this.brandRepository.update(id, {
      ...updateBrandDto,
      updatedById: userId
    })
  }

  async remove(id: number, userId: number) {
    await this.brandRepository.delete(id, userId)

    return {
      message: 'Delete brand successful!'
    }
  }
}

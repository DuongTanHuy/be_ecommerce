import { Injectable } from '@nestjs/common'
import BrandRepository from 'src/routes/brand/brand.repo'
import { CreateBrandBodyType, GetBrandQueryType, UpdateBrandBodyType } from 'src/routes/brand/entities/brand.entity'

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  create(userId: number, createBrandDto: CreateBrandBodyType) {
    return this.brandRepository.create({
      ...createBrandDto,
      createdById: userId
    })
  }

  findAll(pagination: GetBrandQueryType) {
    return this.brandRepository.getAll(pagination)
  }

  findOne(id: number) {
    return this.brandRepository.findOne(id)
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

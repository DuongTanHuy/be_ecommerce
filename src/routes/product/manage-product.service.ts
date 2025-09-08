import { ForbiddenException, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import {
  CreateProductBodyType,
  GetManageProductsQueryType,
  UpdateProductBodyType
} from 'src/routes/product/entities/product.entity'
import ProductRepository from 'src/routes/product/product.repo'
import { RoleName } from 'src/shared/constants/role.constant'
import { NotFoundRecordException } from 'src/shared/error'

@Injectable()
export class ManageProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  private validatePrivilege({
    userIdRequest,
    roleNameRequest,
    createdById
  }: {
    userIdRequest: number
    roleNameRequest: string
    createdById: number | undefined | null
  }) {
    if (userIdRequest !== createdById && roleNameRequest !== RoleName.Admin) {
      throw new ForbiddenException()
    }

    return true
  }

  create(userId: number, createProductDto: CreateProductBodyType) {
    return this.productRepository.create({
      ...createProductDto,
      createdById: userId
    })
  }

  findAll(query: GetManageProductsQueryType, userIdRequest: number, roleNameRequest: string) {
    this.validatePrivilege({
      userIdRequest,
      roleNameRequest,
      createdById: query.createdById
    })
    return this.productRepository.list({ ...query, languageId: I18nContext.current()?.lang as string })
  }

  async getDetail(id: number, userIdRequest: number, roleNameRequest: string) {
    const product = await this.productRepository.getDetail({
      productId: id,
      languageId: I18nContext.current()?.lang as string
    })

    if (!product) {
      throw NotFoundRecordException
    }

    this.validatePrivilege({
      userIdRequest,
      roleNameRequest,
      createdById: product?.createdById
    })

    return product
  }

  async update(id: number, userId: number, roleNameRequest: string, updateProductDto: UpdateProductBodyType) {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw NotFoundRecordException
    }

    this.validatePrivilege({
      userIdRequest: userId,
      roleNameRequest,
      createdById: product.createdById
    })

    return this.productRepository.update(id, {
      ...updateProductDto,
      updatedById: userId
    })
  }

  async remove(id: number, userId: number, roleNameRequest: string) {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw NotFoundRecordException
    }

    this.validatePrivilege({
      userIdRequest: userId,
      roleNameRequest,
      createdById: product.createdById
    })

    return this.productRepository.delete(id, userId)
  }
}

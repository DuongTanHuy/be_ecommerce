import { Injectable } from '@nestjs/common'
import { CreateProductBodyType, UpdateProductBodyType } from 'src/routes/product/entities/product.entity'

@Injectable()
export class ProductService {
  create(createProductDto: CreateProductBodyType) {
    return 'This action adds a new product'
  }

  findAll() {
    return `This action returns all product`
  }

  findOne(id: number) {
    return `This action returns a #${id} product`
  }

  update(id: number, updateProductDto: UpdateProductBodyType) {
    return `This action updates a #${id} product`
  }

  remove(id: number) {
    return `This action removes a #${id} product`
  }
}

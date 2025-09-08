import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import ProductRepository from 'src/routes/product/product.repo'
import { ManageProductController } from 'src/routes/product/manaeg-product.controller'
import { ManageProductService } from 'src/routes/product/manage-product.service'

@Module({
  controllers: [ProductController, ManageProductController],
  providers: [ProductService, ManageProductService, ProductRepository]
})
export class ProductModule {}

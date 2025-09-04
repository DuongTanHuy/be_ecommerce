import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProductService } from './product.service'
import {
  GetProductDetailResDto,
  GetProductParamsDto,
  GetProductsQueryDto,
  GetProductsResDto
} from 'src/routes/product/dto/create-product.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { ZodSerializerDto } from 'nestjs-zod'

@Controller('product')
@IsPublic()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ZodSerializerDto(GetProductsResDto)
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productService.findAll(query)
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDto)
  findOne(@Param() params: GetProductParamsDto) {
    return this.productService.getDetail(params.productId)
  }
}

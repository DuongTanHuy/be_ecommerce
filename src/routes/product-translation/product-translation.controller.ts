import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ProductTranslationService } from './product-translation.service'
import {
  CreateProductTranslationBodyType,
  UpdateProductTranslationBodyType
} from 'src/routes/product-translation/entities/product-translation.entity'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import {
  GetProductTranslationDetailResDto,
  GetProductTranslationParamsDto
} from 'src/routes/product-translation/dto/create-product-translation.dto'
import { ZodSerializerDto } from 'nestjs-zod'

@Controller('product-translation')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  @Post()
  @ZodSerializerDto(GetProductTranslationDetailResDto)
  create(@Body() createProductTranslationDto: CreateProductTranslationBodyType, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.create(userId, createProductTranslationDto)
  }

  @Get(':productTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDto)
  findOne(@Param() params: GetProductTranslationParamsDto) {
    return this.productTranslationService.findOne(params.productTranslationId)
  }

  @Patch(':productTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDto)
  update(
    @Param() params: GetProductTranslationParamsDto,
    @Body() updateProductTranslationDto: UpdateProductTranslationBodyType,
    @ActiveUser('userId') userId: number
  ) {
    return this.productTranslationService.update(params.productTranslationId, userId, updateProductTranslationDto)
  }

  @Delete(':productTranslationId')
  remove(@Param() params: GetProductTranslationParamsDto, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.remove(params.productTranslationId, userId)
  }
}

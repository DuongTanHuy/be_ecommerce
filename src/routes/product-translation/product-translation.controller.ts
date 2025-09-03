import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ProductTranslationService } from './product-translation.service'
import {
  CreateProductTranslationBodyDto,
  UpdateProductTranslationBodyDto
} from 'src/routes/product-translation/dto/create-product-translation.dto'

@Controller('product-translation')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  @Post()
  create(@Body() createProductTranslationDto: CreateProductTranslationBodyDto) {
    return this.productTranslationService.create(createProductTranslationDto)
  }

  @Get()
  findAll() {
    return this.productTranslationService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productTranslationService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductTranslationDto: UpdateProductTranslationBodyDto) {
    return this.productTranslationService.update(+id, updateProductTranslationDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productTranslationService.remove(+id)
  }
}

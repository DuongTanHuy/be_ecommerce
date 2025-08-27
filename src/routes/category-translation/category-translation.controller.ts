import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CategoryTranslationService } from './category-translation.service'
import {
  CreateCategoryTranslationBodyDto,
  GetCategoryTranslationDetailResDto,
  GetCategoryTranslationParamsDto,
  UpdateCategoryTranslationBodyDto
} from 'src/routes/category-translation/dto/create-category-translation.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('category-translation')
export class CategoryTranslationController {
  constructor(private readonly categoryTranslationService: CategoryTranslationService) {}

  @Post()
  @ZodSerializerDto(GetCategoryTranslationDetailResDto)
  create(@Body() createCategoryTranslationDto: CreateCategoryTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.create(userId, createCategoryTranslationDto)
  }

  @Get(':categoryTranslationId')
  @ZodSerializerDto(GetCategoryTranslationDetailResDto)
  findOne(@Param() params: GetCategoryTranslationParamsDto) {
    return this.categoryTranslationService.findOne(params.categoryTranslationId)
  }

  @Patch(':categoryTranslationId')
  @ZodSerializerDto(GetCategoryTranslationDetailResDto)
  update(
    @Param() params: GetCategoryTranslationParamsDto,
    @Body() updateCategoryTranslationDto: UpdateCategoryTranslationBodyDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.categoryTranslationService.update(userId, params.categoryTranslationId, updateCategoryTranslationDto)
  }

  @Delete(':categoryTranslationId')
  remove(@Param() params: GetCategoryTranslationParamsDto, @ActiveUser('userId') userId: number) {
    return this.categoryTranslationService.remove(params.categoryTranslationId, userId)
  }
}

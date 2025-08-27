import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import {
  CreateCategoryBodyDto,
  GetAllCategoriesDto,
  GetAllCategoriesQueryDto,
  GetCategoryDetailResDto,
  GetCategoryParamsDto,
  UpdateCategoryBodyDto
} from 'src/routes/category/dto/create-category.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ZodSerializerDto(GetCategoryDetailResDto)
  create(@Body() createCategoryDto: CreateCategoryBodyDto, @ActiveUser('userId') userId: number) {
    return this.categoryService.create(userId, createCategoryDto)
  }

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetAllCategoriesDto)
  findAll(@Query() query: GetAllCategoriesQueryDto) {
    return this.categoryService.findAll(query.parentCategoryId)
  }

  @Get(':categoryId')
  @IsPublic()
  @ZodSerializerDto(GetCategoryDetailResDto)
  findOne(@Param() params: GetCategoryParamsDto) {
    return this.categoryService.findOne(params.categoryId)
  }

  @Patch(':categoryId')
  @ZodSerializerDto(GetCategoryDetailResDto)
  update(
    @Param() params: GetCategoryParamsDto,
    @Body() updateCategoryDto: UpdateCategoryBodyDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.categoryService.update(userId, params.categoryId, updateCategoryDto)
  }

  @Delete(':categoryId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: GetCategoryParamsDto, @ActiveUser('userId') userId: number) {
    return this.categoryService.remove(params.categoryId, userId)
  }
}

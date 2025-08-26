import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { BrandService } from './brand.service'
import {
  CreateBrandBodyDto,
  CreateBrandResDto,
  GetBrandDetailParamsDto,
  GetBrandDetailResDto,
  GetBrandQueryDto,
  GetBrandResDto,
  UpdateBrandBodyDto,
  UpdateBrandResDto
} from 'src/routes/brand/dto/create-brand.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ZodSerializerDto(CreateBrandResDto)
  create(@Body() createBrandDto: CreateBrandBodyDto, @ActiveUser('userId') userId: number) {
    return this.brandService.create(userId, createBrandDto)
  }

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetBrandResDto)
  findAll(@Query() pagination: GetBrandQueryDto) {
    return this.brandService.findAll(pagination)
  }

  @Get(':brandId')
  @IsPublic()
  @ZodSerializerDto(GetBrandDetailResDto)
  findOne(@Param() params: GetBrandDetailParamsDto) {
    return this.brandService.findOne(+params.brandId)
  }

  @Patch(':brandId')
  @ZodSerializerDto(UpdateBrandResDto)
  update(
    @Param() params: GetBrandDetailParamsDto,
    @Body() updateBrandDto: UpdateBrandBodyDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.brandService.update(+params.brandId, userId, updateBrandDto)
  }

  @Delete(':brandId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: GetBrandDetailParamsDto, @ActiveUser('userId') userId: number) {
    return this.brandService.remove(+params.brandId, userId)
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { BrandTranslationService } from './brand-translation.service'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateBrandTranslationBodyDto,
  CreateBrandTranslationResDto,
  GetBrandTranslationDetailParamsDto,
  GetBrandTranslationDetailResDto,
  UpdateBrandTranslationBodyDto,
  UpdateBrandTranslationResDto
} from 'src/routes/brand-translation/dto/create-brand-translation.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('brand-translation')
export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  @Post()
  @ZodSerializerDto(CreateBrandTranslationResDto)
  create(@Body() createBrandTranslationDto: CreateBrandTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.create(userId, createBrandTranslationDto)
  }

  @Get(':brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDto)
  findOne(@Param() params: GetBrandTranslationDetailParamsDto) {
    return this.brandTranslationService.findOne(+params.brandTranslationId)
  }

  @Patch(':brandTranslationId')
  @ZodSerializerDto(UpdateBrandTranslationResDto)
  update(
    @Param() params: GetBrandTranslationDetailParamsDto,
    @Body() updateBrandTranslationDto: UpdateBrandTranslationBodyDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.brandTranslationService.update(userId, +params.brandTranslationId, updateBrandTranslationDto)
  }

  @Delete(':brandTranslationId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: GetBrandTranslationDetailParamsDto, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.remove(+params.brandTranslationId, userId)
  }
}

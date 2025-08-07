import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { LanguagesService } from './languages.service'
import {
  CreateLanguageBodyDto,
  CreateLanguageResDto,
  GetAllLanguageResDto,
  GetLanguageDetailResDto,
  GetLanguageParamsDto,
  UpdateLanguageBodyDto
} from './dto/create-language.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @ZodSerializerDto(CreateLanguageResDto)
  create(@Body() createLanguageBodyDto: CreateLanguageBodyDto, @ActiveUser('userId') userId: number) {
    return this.languagesService.create({ userId, data: createLanguageBodyDto })
  }

  @Get()
  @ZodSerializerDto(GetAllLanguageResDto)
  findAll() {
    return this.languagesService.findAll()
  }

  @Get(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDto)
  findOne(@Param() params: GetLanguageParamsDto) {
    return this.languagesService.findOne(params.languageId)
  }

  @Patch(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDto)
  update(
    @Param() params: GetLanguageParamsDto,
    @ActiveUser('userId') userId: number,
    @Body() updateLanguageBodyDto: UpdateLanguageBodyDto
  ) {
    return this.languagesService.update(params.languageId, userId, updateLanguageBodyDto)
  }

  @Delete(':languageId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: GetLanguageParamsDto) {
    return this.languagesService.remove(params.languageId)
  }
}

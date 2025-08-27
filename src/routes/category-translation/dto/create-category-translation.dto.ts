import { createZodDto } from 'nestjs-zod'
import {
  CreateCategoryTranslationBodySchema,
  GetCategoryTranslationDetailResSchema,
  GetCategoryTranslationParamsSchema,
  UpdateCategoryTranslationBodySchema
} from 'src/routes/category-translation/entities/category-translation.entity'

class GetCategoryTranslationParamsDto extends createZodDto(GetCategoryTranslationParamsSchema) {}

class GetCategoryTranslationDetailResDto extends createZodDto(GetCategoryTranslationDetailResSchema) {}

class CreateCategoryTranslationBodyDto extends createZodDto(CreateCategoryTranslationBodySchema) {}

class UpdateCategoryTranslationBodyDto extends createZodDto(UpdateCategoryTranslationBodySchema) {}

export {
  GetCategoryTranslationParamsDto,
  GetCategoryTranslationDetailResDto,
  CreateCategoryTranslationBodyDto,
  UpdateCategoryTranslationBodyDto
}

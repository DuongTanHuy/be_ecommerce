import { createZodDto } from 'nestjs-zod'
import {
  CreateBrandTranslationBodySchema,
  CreateBrandTranslationResSchema,
  GetBrandTranslationDetailParamsSchema,
  GetBrandTranslationDetailResSchema,
  UpdateBrandTranslationBodySchema
} from 'src/routes/brand-translation/entities/brand-translation.entity'

class GetBrandTranslationDetailParamsDto extends createZodDto(GetBrandTranslationDetailParamsSchema) {}

class GetBrandTranslationDetailResDto extends createZodDto(GetBrandTranslationDetailResSchema) {}

class CreateBrandTranslationBodyDto extends createZodDto(CreateBrandTranslationBodySchema) {}

class CreateBrandTranslationResDto extends createZodDto(CreateBrandTranslationResSchema) {}

class UpdateBrandTranslationBodyDto extends createZodDto(UpdateBrandTranslationBodySchema) {}

class UpdateBrandTranslationResDto extends createZodDto(CreateBrandTranslationResSchema) {}

export {
  GetBrandTranslationDetailParamsDto,
  GetBrandTranslationDetailResDto,
  CreateBrandTranslationBodyDto,
  CreateBrandTranslationResDto,
  UpdateBrandTranslationBodyDto,
  UpdateBrandTranslationResDto
}

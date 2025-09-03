import { createZodDto } from 'nestjs-zod'
import {
  CreateProductTranslationBodySchema,
  GetProductTranslationDetailResSchema,
  GetProductTranslationParamsSchema,
  UpdateProductTranslationBodySchema
} from 'src/routes/product-translation/entities/product-translation.entity'

class GetProductTranslationParamsDto extends createZodDto(GetProductTranslationParamsSchema) {}

class GetProductTranslationDetailResDto extends createZodDto(GetProductTranslationDetailResSchema) {}

class CreateProductTranslationBodyDto extends createZodDto(CreateProductTranslationBodySchema) {}

class UpdateProductTranslationBodyDto extends createZodDto(UpdateProductTranslationBodySchema) {}

export {
  GetProductTranslationParamsDto,
  GetProductTranslationDetailResDto,
  CreateProductTranslationBodyDto,
  UpdateProductTranslationBodyDto
}

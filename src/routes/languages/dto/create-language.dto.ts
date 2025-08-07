import { createZodDto } from 'nestjs-zod'
import {
  CreateLanguageBodySchema,
  CreateLanguageResSchema,
  GetAllLanguageResSchema,
  GetDetailLanguageResSchema,
  GetLanguageParamsSchema,
  UpdateLanguageBodySchema,
  UpdateLanguageResSchema
} from 'src/routes/languages/entities/language.entity'

class GetAllLanguageResDto extends createZodDto(GetAllLanguageResSchema) {}
class GetLanguageParamsDto extends createZodDto(GetLanguageParamsSchema) {}
class GetLanguageDetailResDto extends createZodDto(GetDetailLanguageResSchema) {}
class CreateLanguageBodyDto extends createZodDto(CreateLanguageBodySchema) {}
class CreateLanguageResDto extends createZodDto(CreateLanguageResSchema) {}
class UpdateLanguageBodyDto extends createZodDto(UpdateLanguageBodySchema) {}
class UpdateLanguageResDto extends createZodDto(UpdateLanguageResSchema) {}

export {
  GetAllLanguageResDto,
  GetLanguageParamsDto,
  GetLanguageDetailResDto,
  CreateLanguageBodyDto,
  CreateLanguageResDto,
  UpdateLanguageBodyDto,
  UpdateLanguageResDto
}

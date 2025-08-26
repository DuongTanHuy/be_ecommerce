import { createZodDto } from 'nestjs-zod'
import {
  CreateBrandBodySchema,
  CreateBrandResSchema,
  GetBrandDetailParamsSchema,
  GetBrandDetailResSchema,
  GetBrandQuerySchema,
  GetBrandResSchema,
  UpdateBrandBodySchema,
  UpdateBrandResSchema
} from 'src/routes/brand/entities/brand.entity'

class GetBrandQueryDto extends createZodDto(GetBrandQuerySchema) {}

class GetBrandResDto extends createZodDto(GetBrandResSchema) {}

class GetBrandDetailResDto extends createZodDto(GetBrandDetailResSchema) {}

class CreateBrandBodyDto extends createZodDto(CreateBrandBodySchema) {}

class CreateBrandResDto extends createZodDto(CreateBrandResSchema) {}

class UpdateBrandBodyDto extends createZodDto(UpdateBrandBodySchema) {}

class UpdateBrandResDto extends createZodDto(UpdateBrandResSchema) {}

class GetBrandDetailParamsDto extends createZodDto(GetBrandDetailParamsSchema) {}

export {
  GetBrandQueryDto,
  GetBrandResDto,
  GetBrandDetailResDto,
  CreateBrandBodyDto,
  CreateBrandResDto,
  UpdateBrandBodyDto,
  UpdateBrandResDto,
  GetBrandDetailParamsDto
}

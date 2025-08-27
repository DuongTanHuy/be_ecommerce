import { createZodDto } from 'nestjs-zod'
import {
  CreateCategoryBodySchema,
  GetAllCategoriesQuerySchema,
  GetAllCategoriesSchema,
  GetCategoryDetailResSchema,
  GetCategoryParamsSchema,
  UpdateCategoryBodySchema
} from 'src/routes/category/entities/category.entity'

class GetAllCategoriesDto extends createZodDto(GetAllCategoriesSchema) {}

class GetAllCategoriesQueryDto extends createZodDto(GetAllCategoriesQuerySchema) {}

class GetCategoryParamsDto extends createZodDto(GetCategoryParamsSchema) {}

class GetCategoryDetailResDto extends createZodDto(GetCategoryDetailResSchema) {}

class CreateCategoryBodyDto extends createZodDto(CreateCategoryBodySchema) {}

class UpdateCategoryBodyDto extends createZodDto(UpdateCategoryBodySchema) {}

export {
  GetAllCategoriesDto,
  GetAllCategoriesQueryDto,
  GetCategoryParamsDto,
  GetCategoryDetailResDto,
  CreateCategoryBodyDto,
  UpdateCategoryBodyDto
}

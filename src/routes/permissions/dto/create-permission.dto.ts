import {
  CreatePermissionBodySchema,
  GetPermissionDetailResSchema,
  GetPermissionParamsSchema,
  GetPermissionQuerySchema,
  GetPermissionResSchema,
  UpdatePermissionBodySchema
} from 'src/routes/permissions/entities/permission.entity'
import { createZodDto } from 'nestjs-zod'

class GetPermissionQueryDto extends createZodDto(GetPermissionQuerySchema) {}
class GetPermissionParamsDto extends createZodDto(GetPermissionParamsSchema) {}
class GetPermissionResDto extends createZodDto(GetPermissionResSchema) {}
class GetPermissionDetailResDto extends createZodDto(GetPermissionDetailResSchema) {}
class CreatePermissionBodyDto extends createZodDto(CreatePermissionBodySchema) {}
class UpdatePermissionBodyDto extends createZodDto(UpdatePermissionBodySchema) {}

export {
  GetPermissionQueryDto,
  GetPermissionParamsDto,
  GetPermissionResDto,
  GetPermissionDetailResDto,
  CreatePermissionBodyDto,
  UpdatePermissionBodyDto
}

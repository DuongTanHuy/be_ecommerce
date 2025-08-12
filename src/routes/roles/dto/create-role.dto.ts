import { createZodDto } from 'nestjs-zod'
import {
  CreateRoleBodySchema,
  CreateRoleResSchema,
  GetRoleDetailParamsSchema,
  GetRoleDetailResSchema,
  GetRoleQuerySchema,
  GetRoleResSchema,
  UpdateRoleBodySchema
} from 'src/routes/roles/entities/role.entity'

class GetRoleQueryDto extends createZodDto(GetRoleQuerySchema) {}
class GetRoleResDto extends createZodDto(GetRoleResSchema) {}
class GetRoleDetailParamsDto extends createZodDto(GetRoleDetailParamsSchema) {}
class GetRoleDetailResDto extends createZodDto(GetRoleDetailResSchema) {}
class CreateRoleBodyDto extends createZodDto(CreateRoleBodySchema) {}
class CreateRoleResDto extends createZodDto(CreateRoleResSchema) {}
class UpdateRoleBodyDto extends createZodDto(UpdateRoleBodySchema) {}

export {
  GetRoleQueryDto,
  GetRoleResDto,
  GetRoleDetailParamsDto,
  GetRoleDetailResDto,
  CreateRoleBodyDto,
  CreateRoleResDto,
  UpdateRoleBodyDto
}

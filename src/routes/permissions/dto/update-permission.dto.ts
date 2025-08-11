import { PartialType } from '@nestjs/mapped-types'
import { CreatePermissionBodyDto } from './create-permission.dto'

export class UpdatePermissionDto extends PartialType(CreatePermissionBodyDto) {}

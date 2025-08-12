import { PartialType } from '@nestjs/mapped-types'
import { CreateRoleBodyDto } from './create-role.dto'

export class UpdateRoleDto extends PartialType(CreateRoleBodyDto) {}

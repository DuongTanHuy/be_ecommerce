import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { RolesService } from './roles.service'
import {
  CreateRoleBodyDto,
  GetRoleDetailParamsDto,
  GetRoleDetailResDto,
  GetRoleQueryDto,
  GetRoleResDto,
  UpdateRoleBodyDto
} from './dto/create-role.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { CreateRoleResSchema } from 'src/routes/roles/entities/role.entity'

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ZodSerializerDto(CreateRoleResSchema)
  create(@Body() createRoleBodyDto: CreateRoleBodyDto, @ActiveUser('userId') userId: number) {
    return this.rolesService.create(createRoleBodyDto, userId)
  }

  @Get()
  @ZodSerializerDto(GetRoleResDto)
  findAll(@Query() query: GetRoleQueryDto) {
    return this.rolesService.findAll({
      page: query.page,
      limit: query.limit
    })
  }

  @Get(':roleId')
  @ZodSerializerDto(GetRoleDetailResDto)
  findOne(@Param() params: GetRoleDetailParamsDto) {
    return this.rolesService.findOne(+params.roleId)
  }

  @Patch(':roleId')
  @ZodSerializerDto(GetRoleDetailResDto)
  update(
    @Param() params: GetRoleDetailParamsDto,
    @Body() updateRoleDto: UpdateRoleBodyDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.rolesService.update(+params.roleId, userId, updateRoleDto)
  }

  @Delete(':roleId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: GetRoleDetailParamsDto, @ActiveUser('userId') userId: number) {
    return this.rolesService.remove(+params.roleId, userId)
  }
}

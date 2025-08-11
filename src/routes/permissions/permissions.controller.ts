import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreatePermissionBodyDto,
  GetPermissionDetailResDto,
  GetPermissionParamsDto,
  GetPermissionQueryDto,
  GetPermissionResDto,
  UpdatePermissionBodyDto
} from 'src/routes/permissions/dto/create-permission.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ZodSerializerDto(GetPermissionDetailResDto)
  create(@Body() createPermissionBodyDto: CreatePermissionBodyDto, @ActiveUser('userId') userId: number) {
    return this.permissionsService.create(userId, createPermissionBodyDto)
  }

  @Get()
  @ZodSerializerDto(GetPermissionResDto)
  findAll(@Query() query: GetPermissionQueryDto) {
    return this.permissionsService.findAll(query)
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDto)
  findOne(@Param() params: GetPermissionParamsDto) {
    return this.permissionsService.findOne(+params.permissionId)
  }

  @Patch(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDto)
  update(
    @Param() params: GetPermissionParamsDto,
    @Body() updatePermissionBodyDto: UpdatePermissionBodyDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.permissionsService.update(userId, +params.permissionId, updatePermissionBodyDto)
  }

  @Delete(':permissionId')
  @ZodSerializerDto(MessageResDto)
  remove(@Param() params: GetPermissionParamsDto, @ActiveUser('userId') userId: number) {
    return this.permissionsService.remove(+params.permissionId, userId)
  }
}

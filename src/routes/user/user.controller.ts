import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateUserBodyDto,
  CreateUserResDto,
  GetUserParamDto,
  GetUserQueryDto,
  GetUserResDto,
  UpdateUserBodyDto
} from 'src/routes/user/dto/create-user.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ProfileDetailResDto } from 'src/shared/dtos/shared-user.dto'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { ActiveRolePermissions } from 'src/shared/decorators/avtive-role-permissions-devorator'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ZodSerializerDto(CreateUserResDto)
  create(
    @Body() createUserBodyDto: CreateUserBodyDto,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') createdByRoleName: string
  ) {
    return this.userService.create(createdByRoleName, userId, createUserBodyDto)
  }

  @Get()
  @ZodSerializerDto(GetUserResDto)
  findAll(@Query() query: GetUserQueryDto) {
    return this.userService.findAll({ page: query.page, limit: query.limit })
  }

  @Get(':userId')
  @ZodSerializerDto(ProfileDetailResDto)
  findOne(@Param() params: GetUserParamDto) {
    return this.userService.findOne(+params.userId)
  }

  @Patch(':userId')
  update(
    @Param() params: GetUserParamDto,
    @ActiveUser('userId') activeUserId: number,
    @Body() updateUserDto: UpdateUserBodyDto,
    @ActiveRolePermissions('name') updatedByRoleName: string
  ) {
    return this.userService.update(+params.userId, updateUserDto, activeUserId, updatedByRoleName)
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDto)
  remove(
    @Param() params: GetUserParamDto,
    @ActiveUser('userId') activeUserId: number,
    @ActiveRolePermissions('name') deletedByRoleName: string
  ) {
    return this.userService.remove(+params.userId, activeUserId, deletedByRoleName)
  }
}

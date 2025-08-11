import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { PermissionRepository } from 'src/routes/permissions/permissions.repo'
import { GetPermissionQueryDto } from 'src/routes/permissions/dto/create-permission.dto'
import { CreatePermissionBodyType, UpdatePermissionBodyType } from 'src/routes/permissions/entities/permission.entity'

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async create(userId: number, createPermissionDto: CreatePermissionBodyType) {
    return this.permissionRepository.create({
      ...createPermissionDto,
      createdById: userId
    })
  }

  findAll(pagination: GetPermissionQueryDto) {
    return this.permissionRepository.findAll(pagination)
  }

  async findOne(id: number) {
    const result = await this.permissionRepository.findById(id)

    if (!result) {
      throw new UnprocessableEntityException({
        message: 'Permission not found',
        path: ''
      })
    }

    return result
  }

  update(userId: number, permissionId: number, body: UpdatePermissionBodyType) {
    return this.permissionRepository.update(permissionId, {
      ...body,
      updatedById: userId
    })
  }

  async remove(id: number, userId: number) {
    await this.permissionRepository.delete(id, userId)

    return { message: 'Permission deleted successfully' }
  }
}

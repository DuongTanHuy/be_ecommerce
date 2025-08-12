import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { CreateRoleBodyType, UpdateRoleBodyType } from 'src/routes/roles/entities/role.entity'
import { RoleRepository } from 'src/routes/roles/roles.repo'

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  create(createRoleDto: CreateRoleBodyType, userId: number) {
    return this.roleRepository.create({
      ...createRoleDto,
      createdById: userId
    })
  }

  findAll(pagination: { page: number; limit: number }) {
    return this.roleRepository.findAll(pagination)
  }

  async findOne(id: number) {
    const result = await this.roleRepository.findOne(id)

    if (!result) {
      throw new UnprocessableEntityException([
        {
          message: 'Role is not found',
          path: 'roleId'
        }
      ])
    }
    return result
  }

  update(id: number, userId: number, updateRoleDto: UpdateRoleBodyType) {
    return this.roleRepository.update(id, {
      ...updateRoleDto,
      updatedById: userId
    })
  }

  async remove(id: number, userId: number) {
    await this.roleRepository.remove(id, userId)

    return {
      message: 'Role deleted successful'
    }
  }
}

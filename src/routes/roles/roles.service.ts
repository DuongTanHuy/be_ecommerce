import { ForbiddenException, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { CreateRoleBodyType, UpdateRoleBodyType } from 'src/routes/roles/entities/role.entity'
import { RoleRepository } from 'src/routes/roles/roles.repo'
import { RoleName } from 'src/shared/constants/role.constant'

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

  async update(id: number, userId: number, updateRoleDto: UpdateRoleBodyType) {
    const role = await this.roleRepository.findOne(id)
    if (!role) {
      throw new UnprocessableEntityException([
        {
          message: 'Role is not found',
          path: 'roleId'
        }
      ])
    }

    if (role.name === RoleName.Admin) {
      throw new ForbiddenException()
    }

    return this.roleRepository.update(id, {
      ...updateRoleDto,
      updatedById: userId
    })
  }

  async remove(id: number, userId: number) {
    await this.verifyRole(id)

    await this.roleRepository.remove(id, userId)

    return {
      message: 'Role deleted successful'
    }
  }

  private async verifyRole(roleId: number) {
    const role = await this.roleRepository.findOne(roleId)
    if (!role) {
      throw new UnprocessableEntityException([
        {
          message: 'Role is not found',
          path: 'roleId'
        }
      ])
    }
    const baseRoles: string[] = [RoleName.Admin, RoleName.Client, RoleName.Seller]

    if (baseRoles.includes(role.name)) {
      throw new ForbiddenException()
    }
  }
}

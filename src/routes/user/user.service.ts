import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserBodyType, UpdateUserBodyType } from 'src/routes/user/entities/user.entity'
import UserRepository from 'src/routes/user/user.repo'
import { RoleName } from 'src/shared/constants/role.constant'
import SharedRoleRepository from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { SharedService } from 'src/shared/services/shared.service'

@Injectable()
export class UserService {
  constructor(
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly sharedRoleRepository: SharedRoleRepository,
    private readonly userRepository: UserRepository,
    private readonly sharedService: SharedService
  ) {}

  private async verifyRole(roleNameAgent: string, roleIdTarget: number) {
    if (roleNameAgent === RoleName.Admin) {
      return true
    }

    const adminRoleId = await this.sharedRoleRepository.getAdminRoleId()
    if (roleIdTarget === adminRoleId) {
      throw new ForbiddenException()
    }

    return true
  }

  private async getRoleIdByUserId(userId: number) {
    const currentUser = await this.sharedUserRepository.findUnique({
      id: userId
    })

    if (!currentUser) {
      throw new NotFoundException()
    }

    return currentUser.roleId
  }

  private verifyYourself({ userAgentId, userTargetId }) {
    if (userAgentId === userTargetId) {
      throw new ForbiddenException()
    }
  }

  async create(createdByRoleName: string, userId: number, createUserDto: CreateUserBodyType) {
    await this.verifyRole(createdByRoleName, createUserDto.roleId)

    const hashedPassword = await this.sharedService.hash(createUserDto.password)

    const newUser = await this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
      createdById: userId
    })

    return newUser
  }

  findAll(pagination: { limit: number; page: number }) {
    return this.userRepository.findAll(pagination)
  }

  findOne(id: number) {
    return this.sharedUserRepository.findUniqueIncludeRolePermissions({
      id
    })
  }

  async update(id: number, updateUserDto: UpdateUserBodyType, userId: number, updatedByRoleName: string) {
    this.verifyYourself({
      userAgentId: userId,
      userTargetId: id
    })

    if (id === userId) {
      throw new ForbiddenException()
    }

    const roleTarget = await this.getRoleIdByUserId(id)

    await this.verifyRole(updatedByRoleName, roleTarget)

    return await this.sharedUserRepository.update(
      {
        id
      },
      {
        ...updateUserDto,
        updatedById: userId
      }
    )
  }

  async remove(id: number, userId: number, deletedByRoleName: string) {
    this.verifyYourself({
      userAgentId: userId,
      userTargetId: id
    })

    const roleTarget = await this.getRoleIdByUserId(id)

    await this.verifyRole(deletedByRoleName, roleTarget)

    await this.userRepository.delete(id, userId)

    return {
      message: 'Deleted user successfully'
    }
  }
}

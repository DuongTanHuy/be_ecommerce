import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common'
import { ChangePasswordBodyType, ProfileUpdateBodyType } from 'src/routes/profile/entities/profile.entity'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { SharedService } from 'src/shared/services/shared.service'

@Injectable()
export class ProfileService {
  constructor(
    private readonly sharedUserRepository: SharedUserRepository,
    private sharedService: SharedService
  ) {}

  findOne(id: number) {
    return this.sharedUserRepository.findUniqueIncludeRolePermissions({
      id
    })
  }

  update(userId: number, updateProfileDto: ProfileUpdateBodyType) {
    return this.sharedUserRepository.update(
      { id: userId },
      {
        ...updateProfileDto,
        updatedById: userId
      }
    )
  }

  async changePassword(userId: number, changePasswordBody: ChangePasswordBodyType) {
    const user = await this.sharedUserRepository.findUnique({ id: userId })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const isPasswordMatch = await this.sharedService.compare(changePasswordBody.password, user.password)

    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          message: 'Password is incorrect',
          path: 'password'
        }
      ])
    }

    const hashedPassword = await this.sharedService.hash(changePasswordBody.newPassword)

    await this.sharedUserRepository.update(
      {
        id: userId
      },
      {
        password: hashedPassword,
        updatedById: userId
      }
    )
    return {
      message: 'Change password successful'
    }
  }
}

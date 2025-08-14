import { Controller, Get, Body, Patch, Put } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { ChangePasswordBodyDto, ProfileUpdateBodyDto } from 'src/routes/profile/dto/create-profile.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { ProfileDetailResDto, ProfileUpdateResDto } from 'src/shared/dtos/shared-user.dto'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodSerializerDto(ProfileDetailResDto)
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.findOne(userId)
  }

  @Patch()
  @ZodSerializerDto(ProfileUpdateResDto)
  update(@Body() profileUpdateBodyDto: ProfileUpdateBodyDto, @ActiveUser('userId') userId: number) {
    return this.profileService.update(userId, profileUpdateBodyDto)
  }

  @Put('/change-password')
  @ZodSerializerDto(MessageResDto)
  changePassword(@Body() changePasswordBodyDto: ChangePasswordBodyDto, @ActiveUser('userId') userId: number) {
    return this.profileService.changePassword(userId, changePasswordBodyDto)
  }
}

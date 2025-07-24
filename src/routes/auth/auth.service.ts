import ms, { StringValue } from 'ms'
import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { RolesService } from 'src/routes/auth/roles.service'
import { SharedService } from 'src/shared/services/shared.service'
import { RegisterBodyType, SendOptBodyType } from 'src/routes/auth/entities/auth.entity'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { generateOtp } from 'src/shared/helpers'
import { addMilliseconds } from 'date-fns'
import envConfig from 'src/shared/config'

@Injectable()
export class AuthService {
  constructor(
    private readonly sharedService: SharedService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository
  ) {}

  async register(createAuthDto: RegisterBodyType) {
    const { email, password, name, phoneNumber } = createAuthDto
    const roleId = await this.rolesService.getClientRoleId()
    const hashedPassword = await this.sharedService.hash(password)

    const newUser = await this.authRepository.createUser({
      email,
      name,
      password: hashedPassword,
      phoneNumber,
      roleId
    })

    return newUser
  }

  async sendOtp(sendOtpBodyDto: SendOptBodyType) {
    const { email, type } = sendOtpBodyDto
    const isUserExist = await this.sharedUserRepository.findUnique({ email })

    if (isUserExist) {
      throw new UnprocessableEntityException([
        {
          message: 'Email already exist',
          path: 'email'
        }
      ])
    }

    const code = generateOtp()
    const verificationCode = this.authRepository.createVerificationCode({
      email,
      code,
      type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue))
    })

    return verificationCode
  }
}

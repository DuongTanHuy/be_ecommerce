import ms, { StringValue } from 'ms'
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { RolesService } from 'src/routes/auth/roles.service'
import { SharedService } from 'src/shared/services/shared.service'
import {
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOtpBodyType
} from 'src/routes/auth/entities/auth.entity'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { generateOtp } from 'src/shared/helpers'
import { addMilliseconds } from 'date-fns'
import envConfig from 'src/shared/config'
import { VerificationCode } from 'src/shared/constants/auth.constant'
import { EmailService } from 'src/shared/services/email.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayloadCreate } from 'src/shared/types/jwt.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly sharedService: SharedService,
    private readonly rolesService: RolesService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository
  ) {}

  async generateToken({ userId, deviceId, roleId, roleName }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
        roleId,
        roleName
      }),
      this.tokenService.signRefreshToken({
        userId
      })
    ])

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)

    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      deviceId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000)
    })

    return {
      accessToken,
      refreshToken
    }
  }

  async login(
    loginBodyDto: LoginBodyType & {
      userAgent: string
      ip: string
    }
  ) {
    const user = await this.authRepository.findUniqueUserIncludeRole({ email: loginBodyDto.email })

    if (!user) {
      throw new UnprocessableEntityException([
        {
          message: 'User not found',
          path: 'email'
        }
      ])
    }

    const isPasswordMath = await this.sharedService.compare(loginBodyDto.password, user.password)

    if (!isPasswordMath) {
      throw new UnprocessableEntityException([
        {
          message: 'Password is incorrect',
          path: 'password'
        }
      ])
    }

    const [, tokens] = await Promise.all([
      this.authRepository.createDevice({
        userId: user.id,
        userAgent: loginBodyDto.userAgent,
        ip: loginBodyDto.ip
      }),
      this.generateToken({
        userId: user.id,
        deviceId: user.id,
        roleId: user.roleId,
        roleName: user.role.name
      })
    ])

    return tokens
  }

  async register(createAuthDto: RegisterBodyType) {
    const { email, password, name, phoneNumber, code } = createAuthDto

    const verificationCode = await this.authRepository.findUniqueVerificationCode({
      email,
      code,
      type: VerificationCode.REGISTER
    })

    if (!verificationCode) {
      throw new UnprocessableEntityException([
        {
          message: 'Otp code is invalid',
          path: 'code'
        }
      ])
    }

    if (verificationCode.expiresAt < new Date()) {
      throw new UnprocessableEntityException([
        {
          message: 'Otp code is expired',
          path: 'code'
        }
      ])
    }

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

  async sendOtp(sendOtpBodyDto: SendOtpBodyType) {
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
    await this.authRepository.createVerificationCode({
      email,
      code,
      type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue))
    })

    const { error } = await this.emailService.sendOtp({
      email,
      code
    })

    if (error) {
      throw new UnprocessableEntityException([
        {
          message: 'Send verification otp code failure',
          path: 'code'
        }
      ])
    }

    return {
      message: 'Send OTP code successful'
    }
  }

  async refreshToken({
    token,
    userAgent,
    ip
  }: RefreshTokenBodyType & {
    userAgent: string
    ip: string
  }) {
    const { userId } = await this.tokenService.verifyRefreshToken(token)

    if (!userId) {
      throw new UnprocessableEntityException([
        {
          message: 'Refresh token is invalid',
          path: 'refreshToken'
        }
      ])
    }

    const refreshTokenData = await this.authRepository.findUniqueRefreshTokenIncludeUserRole({ token })

    if (!refreshTokenData) {
      throw new UnauthorizedException('Refresh token is lost')
    }

    const {
      deviceId,
      user: {
        roleId,
        role: { name: roleName }
      }
    } = refreshTokenData

    const $updateDevice = this.authRepository.updateDevice(deviceId, {
      userAgent,
      ip
    })

    const $deleteOldToken = this.authRepository.deleteRefreshToken({ token })

    const $generateTokens = this.generateToken({
      userId,
      deviceId,
      roleId,
      roleName
    })
    const [, , tokens] = await Promise.all([$updateDevice, $deleteOldToken, $generateTokens])

    return tokens
  }

  async logout(token: string) {
    const { userId } = await this.tokenService.verifyRefreshToken(token)

    if (!userId) {
      throw new UnprocessableEntityException([
        {
          message: 'Refresh token is invalid',
          path: 'refreshToken'
        }
      ])
    }

    const { deviceId } = await this.authRepository.deleteRefreshToken({ token })

    await this.authRepository.updateDevice(deviceId, {
      isActive: false
    })

    return {
      message: 'Logout successful'
    }
  }
}

import { Controller, Post, Body, Ip, Get, Query, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  GetAuthorizationUrlResDto,
  LoginBodyDto,
  LoginResDto,
  LogoutBodyDto,
  RefreshTokenBodyDto,
  RefreshTokenResDto,
  RegisterBodyDto,
  RegisterResDto,
  SendOtpBodyDto
} from './dto/create-auth.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { GoogleService } from 'src/routes/auth/google.service'
import { Response } from 'express'
import envConfig from 'src/shared/config'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService
  ) {}

  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterResDto)
  register(@Body() createAuthDto: RegisterBodyDto) {
    return this.authService.register(createAuthDto)
  }

  @Post('login')
  @IsPublic()
  @ZodSerializerDto(LoginResDto)
  login(
    @Body()
    loginBodyDto: LoginBodyDto,
    @UserAgent() userAgent: string,
    @Ip() ip: string
  ) {
    return this.authService.login({
      ...loginBodyDto,
      userAgent,
      ip
    })
  }

  @Post('otp')
  @IsPublic()
  @ZodSerializerDto(MessageResDto)
  sendOtp(@Body() sendOtpBodyDto: SendOtpBodyDto) {
    return this.authService.sendOtp(sendOtpBodyDto)
  }

  @Post('refresh-token')
  @IsPublic()
  @ZodSerializerDto(RefreshTokenResDto)
  refreshToken(@Body() refreshTokenBodyDto: RefreshTokenBodyDto, @UserAgent() userAgent: string, @Ip() ip: string) {
    return this.authService.refreshToken({
      ...refreshTokenBodyDto,
      userAgent,
      ip
    })
  }

  @Post('logout')
  @ZodSerializerDto(MessageResDto)
  logout(@Body() logoutBodyDto: LogoutBodyDto) {
    return this.authService.logout(logoutBodyDto.token)
  }

  @Get('google-link')
  @IsPublic()
  @ZodSerializerDto(GetAuthorizationUrlResDto)
  getGoogleLink(@UserAgent() userAgent: string, @Ip() ip: string) {
    return this.googleService.generateAuthUrl({
      userAgent,
      ip
    })
  }

  @Get('google/callback')
  @IsPublic()
  async googleCallback(@Query() query: { state: string; code: string }, @Res() res: Response) {
    try {
      const data = await this.googleService.googleCallback(query)

      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login with Google failed'
      return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`)
    }
  }
}

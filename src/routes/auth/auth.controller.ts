import { Controller, Post, Body, Ip } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}

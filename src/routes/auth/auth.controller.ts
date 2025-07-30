import { Controller, Post, Body, Ip } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  LoginBodyDto,
  LoginResDto,
  RegisterBodyDto,
  RegisterResDto,
  SendOtpBodyDto,
  SendOtpResDto
} from './dto/create-auth.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDto)
  register(@Body() createAuthDto: RegisterBodyDto) {
    return this.authService.register(createAuthDto)
  }

  @Post('login')
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
  @ZodSerializerDto(SendOtpResDto)
  sendOtp(@Body() sendOtpBodyDto: SendOtpBodyDto) {
    return this.authService.sendOtp(sendOtpBodyDto)
  }
}

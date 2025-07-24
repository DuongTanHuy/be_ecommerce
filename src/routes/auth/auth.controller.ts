import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDto, RegisterResDto, SendOtpBodyDto } from './dto/create-auth.dto'
import { ZodSerializerDto } from 'nestjs-zod'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDto)
  register(@Body() createAuthDto: RegisterBodyDto) {
    return this.authService.register(createAuthDto)
  }

  @Post('otp')
  sendOtp(@Body() sendOtpBodyDto: SendOtpBodyDto) {
    return this.authService.sendOtp(sendOtpBodyDto)
  }
}

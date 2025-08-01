import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { RolesService } from './roles.service'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { GoogleService } from 'src/routes/auth/google.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, RolesService, GoogleService, AuthRepository]
})
export class AuthModule {}

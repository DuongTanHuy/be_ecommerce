import { Global, Module } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from './services/token.service'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'
import { SharedService } from 'src/shared/services/shared.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'

const sharedServices = [PrismaService, SharedService, TokenService]

@Global()
@Module({
  imports: [JwtModule],
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    ApiKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    }
  ],
  exports: sharedServices
})
export class SharedModule {}

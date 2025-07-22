import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import envConfig from 'src/shared/config'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    const apiKey = request.headers['x-api-key']

    if (!apiKey) {
      throw new UnauthorizedException('Api key is required')
    }

    if (apiKey !== envConfig.SECRET_KEY) {
      throw new UnauthorizedException('Api key is invalid')
    }

    return true
  }
}

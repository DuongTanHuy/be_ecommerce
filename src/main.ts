import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import envConfig from 'src/shared/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(envConfig.POST ?? 3000)
}
bootstrap()

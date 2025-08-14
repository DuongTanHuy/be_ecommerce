import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from 'src/shared/shared.module'
import { AuthModule } from './routes/auth/auth.module'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import MyZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter'
import { CatchEverythingFilter } from 'src/shared/filters/catch-everything.filter'
import { LanguagesModule } from './routes/languages/languages.module'
import { PermissionsModule } from './routes/permissions/permissions.module'
import { RolesModule } from './routes/roles/roles.module'
import { ProfileModule } from './routes/profile/profile.module';

@Module({
  imports: [SharedModule, AuthModule, LanguagesModule, PermissionsModule, RolesModule, ProfileModule],
  controllers: [AppController],
  providers: [
    AppService,
    // global validation cua RegisterBodyDto...
    {
      provide: APP_PIPE,
      useClass: MyZodValidationPipe
    },
    // global serializer cua RegisterResDto...
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: CatchEverythingFilter
    }
  ]
})
export class AppModule {}

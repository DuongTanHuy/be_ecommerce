import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
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
import { ProfileModule } from './routes/profile/profile.module'
import { UserModule } from './routes/user/user.module'
import { MediaModule } from './routes/media/media.module'
import { BrandModule } from './routes/brand/brand.module'
import { BrandTranslationModule } from './routes/brand-translation/brand-translation.module'
import { CategoryModule } from './routes/category/category.module'
import { CategoryTranslationModule } from './routes/category-translation/category-translation.module'
import { ProductModule } from './routes/product/product.module'
import { ProductTranslationModule } from './routes/product-translation/product-translation.module'
import { CartModule } from './routes/cart/cart.module'
import path from 'path'

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve('src/i18n/'),
        watch: true
      },
      typesOutputPath: path.resolve('src/generated/i18n.generated.ts'),
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver]
    }),
    SharedModule,
    AuthModule,
    LanguagesModule,
    PermissionsModule,
    RolesModule,
    ProfileModule,
    UserModule,
    MediaModule,
    BrandModule,
    BrandTranslationModule,
    CategoryModule,
    CategoryTranslationModule,
    ProductModule,
    ProductTranslationModule,
    CartModule
  ],
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

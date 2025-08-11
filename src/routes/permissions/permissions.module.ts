import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { PermissionRepository } from 'src/routes/permissions/permissions.repo'

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionRepository]
})
export class PermissionsModule {}

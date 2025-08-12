import { Module } from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { RoleRepository } from 'src/routes/roles/roles.repo'

@Module({
  controllers: [RolesController],
  providers: [RolesService, RoleRepository]
})
export class RolesModule {}

import { Module } from '@nestjs/common'
import { PermissionResolvers } from './permission/permission.resolver'
import { RoleResolvers } from './role/role.resolver'

@Module({
  providers: [PermissionResolvers, RoleResolvers]
})
export class MainModule {}

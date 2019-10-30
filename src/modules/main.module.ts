import { Module } from '@nestjs/common'
import { PermissionResolvers } from './permission/permission.resolver'
import { RoleResolvers } from './role/role.resolver'
import { UserResolvers } from './user/user.resolver'
import { ServiceResolvers } from './service/service.resolver'

@Module({
  providers: [PermissionResolvers, RoleResolvers, UserResolvers, ServiceResolvers]
})
export class MainModule {}

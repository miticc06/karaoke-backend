import { Module } from '@nestjs/common'
import { PermissionResolvers } from './permission/permission.resolver'
import { RoleResolvers } from './role/role.resolver'
import { UserResolvers } from './user/user.resolver'

@Module({
  providers: [PermissionResolvers, RoleResolvers, UserResolvers]
})
export class MainModule {}

import { Module } from '@nestjs/common'
import { PermissionResolvers } from './permission/permission.resolver'

@Module({
  providers: [PermissionResolvers]
})
export class MainModule {}

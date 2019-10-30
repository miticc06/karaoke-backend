import { Module } from '@nestjs/common'
import { PermissionResolvers } from './permission/permission.resolver'
import { RoleResolvers } from './role/role.resolver'
import { UserResolvers } from './user/user.resolver'
import { TypeRoomResolvers } from './typeroom/typeroom.resolver'
import { RoomResolvers } from './room/room.resolver'

@Module({
  providers: [
    PermissionResolvers,
    RoleResolvers,
    UserResolvers,
    TypeRoomResolvers,
    RoomResolvers
  ]
})
export class MainModule {}

import { Module } from '@nestjs/common'
import { PermissionResolvers } from './permission/permission.resolver'
import { RoleResolvers } from './role/role.resolver'
import { UserResolvers } from './user/user.resolver'
import { TypeRoomResolvers } from './typeroom/typeroom.resolver'
import { RoomResolvers } from './room/room.resolver'
import { ServiceResolvers } from './service/service.resolver'
import { DiscountResolvers } from './discount/discount.resolver'
import { PaymentSlipResolvers } from './payment-slip/payment-slip.resolver'
import { UtilsResolvers } from './utils/utils.resolver'

@Module({
  providers: [
    PermissionResolvers,
    ServiceResolvers,
    RoleResolvers,
    UserResolvers,
    TypeRoomResolvers,
    RoomResolvers,
    DiscountResolvers,
    PaymentSlipResolvers,
    UtilsResolvers
  ]
})
export class MainModule {}

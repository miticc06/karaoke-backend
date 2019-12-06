import { Module } from '@nestjs/common'
import { PermissionResolvers } from './permission/permission.resolver'
import { RoleResolvers } from './role/role.resolver'
import { UserResolvers } from './user/user.resolver'
import { TypeRoomResolvers } from './typeroom/typeroom.resolver'
import { RoomResolvers } from './room/room.resolver'
import { ServiceResolvers } from './service/service.resolver'
import { CustomerResolvers } from './customer/customer.resolver'
import { DiscountResolvers } from './discount/discount.resolver'
import { PaymentSlipResolvers } from './payment-slip/payment-slip.resolver'
import { TicketResolvers } from './ticket/ticket.resolver'
import { UtilsResolvers } from './utils/utils.resolver'

@Module({
  providers: [
    PermissionResolvers,
    ServiceResolvers,
    CustomerResolvers,
    RoleResolvers,
    UserResolvers,
    TypeRoomResolvers,
    RoomResolvers,
    DiscountResolvers,
    PaymentSlipResolvers,
    TicketResolvers,
    UtilsResolvers
  ]
})
export class MainModule {}

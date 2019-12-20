import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent,
  Context
} from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { User as UserEntity } from '../user/user.entity'
import { Customer as CustomerEntity } from '../customer/customer.entity'
import { Bill as BillEntity } from '../bill/bill.entity'
import { Discount as DiscountEntity } from '../discount/discount.entity'

@Resolver('Report')
export class ReportResolvers {
  // @ResolveProperty('createdBy')
  // async resolvePropertyCreatedBy(@Parent() bill) {
  //   const user = await getMongoRepository(UserEntity).findOne({
  //     _id: bill.createdBy
  //   })
  //   return user
  // }
  // @ResolveProperty('discount')
  // async resolvePropertyDiscount(@Parent() bill) {
  //   const discount = await getMongoRepository(DiscountEntity).findOne({
  //     _id: bill.discount
  //   })
  //   return discount
  // }
  // @ResolveProperty('customer')
  // async resolvePropertyCustomer(@Parent() bill) {
  //   const customer = await getMongoRepository(CustomerEntity).findOne({
  //     _id: bill.customer
  //   })
  //   return customer
  // }
  @Query('ReportRevenueRooms')
  async ReportRevenueRooms(
    @Args('startDate') startDate: number,
    @Args('endDate') endDate: number
  ) {
    try {
      const res = await getMongoRepository(BillEntity).find({
        where: {
          $and: [
            {
              state: 20
            },
            {
              createdAt: {
                $gte: startDate
              }
            },
            {
              createdAt: {
                $lte: endDate
              }
            }
          ]
        }
      })
      return res
    } catch (error) {
      return error
    }
  }
}

import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent,
  Context
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { BillInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'
import moment from 'moment'
import { User as UserEntity } from '../user/user.entity'
import { Room as RoomEntiry } from '../room/room.entity'
import { Customer as CustomerEntity } from '../customer/customer.entity'
import { Service as ServiceEntity } from '../service/service.entity'
import { Bill as BillEntity } from './bill.entity'

@Resolver('Bill')
export class BillResolvers {
  @ResolveProperty('createdBy')
  async resolvePropertyCreatedBy(@Parent() bill) {
    const user = await getMongoRepository(UserEntity).findOne({
      _id: bill.createdBy
    })
    return user
  }

  // @ResolveProperty('roomDetails')
  // async resolvePropertyRoomDetails(@Parent() bill) {
  //   const res = []
  //   for (const obj of bill.roomDetails) {
  //     console.log(obj)
  //     const room = await getMongoRepository(RoomEntiry).findOne({
  //       _id: obj.room
  //     })
  //     if (!room) {
  //       throw new ApolloError('Không tìm thấy room! - ResolverProperty')
  //     }
  //     res.push({
  //       ...obj,
  //       room
  //     })
  //   }
  //   return res
  // }

  // @ResolveProperty('serviceDetails')
  // async resolvePropertyServiceDetails(@Parent() bill) {
  //   const res = []
  //   for (const obj of bill.serviceDetails) {
  //     console.log(obj)
  //     const service = await getMongoRepository(ServiceEntity).findOne({
  //       _id: obj.service
  //     })
  //     if (!service) {
  //       throw new ApolloError('Không tìm thấy service! - ResolverProperty')
  //     }
  //     res.push({
  //       ...obj,
  //       service
  //     })
  //   }
  //   return res
  // }

  @ResolveProperty('customer')
  async resolvePropertyCustomer(@Parent() bill) {
    const customer = await getMongoRepository(CustomerEntity).findOne({
      _id: bill.customer
    })
    return customer
  }

  @Mutation('createBill')
  async createBill(@Args('input') input: BillInput, @Context() ctx) {
    console.log(input)
    try {
      if (
        input.roomDetails.length &&
        (await this.billByRoom(input.roomDetails[0].room._id))
      ) {
        throw new ApolloError('Phòng này vẫn đang được sử dụng!')
      }

      if (!ctx.currentUser) {
        throw new ApolloError('Bạn chưa đăng nhập!')
      }

      const bill = {
        ...input,
        _id: uuid.v4(),
        state: 10,
        createdAt: +moment(),
        createdBy: ctx.currentUser._id
      }

      await getMongoRepository(BillEntity).insertOne(bill)
      return bill
    } catch (error) {
      return error
    }
  }

  @Query('billByRoom')
  async billByRoom(@Args('roomId') roomId: string) {
    try {
      const bill = await getMongoRepository(BillEntity).findOne({
        where: {
          state: 10,
          'roomDetails.room._id': roomId
        }
      })
      return bill
    } catch (error) {
      return error
    }
  }
}

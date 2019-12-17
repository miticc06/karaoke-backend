import { Room as RoomEntity } from './room.entity'
import { TypeRoom as TypeRoomEntity } from '../typeroom/typeroom.entity'
import moment from 'moment'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Room as RoomSchema, RoomInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'
import { Bill as BillEntity } from '../bill/bill.entity'
import { Ticket as TicketEntity } from '../ticket/ticket.entity'

@Resolver('Room')
export class RoomResolvers {
  @ResolveProperty('typeRoom')
  async resolvePropertyTypeRoom(@Parent() room) {
    // console.log(typeof room.typeRoom)
    if (typeof room.typeRoom === 'string') {
      const typeRoom = await getMongoRepository(TypeRoomEntity).findOne({
        _id: room.typeRoom
      })
      return typeRoom
    }
    return room.typeRoom
  }

  @ResolveProperty('tickets')
  async resolvePropertyTickets(@Parent() room) {
    return await getMongoRepository(TicketEntity).find({
      where: {
        room: room._id,
        status: {
          $ne: 'CLOSED'
        }
      }
    })
  }

  @ResolveProperty('bill')
  async resolvePropertyBill(@Parent() room) {
    return await getMongoRepository(BillEntity).findOne({
      where: {
        state: 10,
        'roomDetails.room._id': room._id
      }
    })
  }

  @Query('rooms')
  async rooms() {
    try {
      return await getMongoRepository(RoomEntity).find({
        isActive: true
      })
    } catch (error) {
      return error
    }
  }

  @Query('room')
  async room(@Args('roomId') roomId: string) {
    try {
      const room = await getMongoRepository(RoomEntity).findOne({
        _id: roomId,
        isActive: true
      })

      if (!room) {
        throw new ApolloError('Không tìm thấy Room!')
      }

      return room
    } catch (error) {
      return error
    }
  }

  // @Query('roomsInfo')
  // async roomsInfo() {
  //   try {
  //     return await getMongoRepository(RoomEntity).find({
  //       isActive: true
  //     })
  //   } catch (error) {
  //     return error
  //   }
  // }

  @Mutation('createRoom')
  async createRoom(@Args('input') input: RoomInput) {
    try {
      const room = {
        ...input,
        _id: uuid.v4(),
        isActive: true,
        createdAt: +moment()
      }
      const existRoom = await getMongoManager().findOne(RoomEntity, {
        name: input.name
      })

      if (existRoom) {
        throw new ApolloError('Name room đã được sử dụng!')
      }

      return await getMongoManager().save(RoomEntity, room)
    } catch (error) {
      return error
    }
  }

  @Mutation('updateRoom')
  async updateRoom(
    @Args('roomId') roomId: string,
    @Args('input') input: RoomInput
  ) {
    try {
      const foundRoom = await getMongoManager().findOne(RoomEntity, {
        _id: roomId,
        isActive: true
      })

      if (!foundRoom) {
        throw new ApolloError('Room không tìm thấy!')
      }

      const existRoom = await getMongoManager().findOne(RoomEntity, {
        where: {
          $and: [
            {
              _id: {
                $ne: roomId
              }
            },
            {
              name: input.name
            }
          ]
        }
      })

      if (existRoom) {
        throw new ApolloError('Name Room này đã được sử dụng!')
      }

      const result = await getMongoManager().update(
        RoomEntity,
        { _id: roomId },
        {
          ...input
        }
      )

      if (!result) {
        throw new ApolloError('Update room không thành công!')
      }

      return {
        ...input,
        _id: roomId
      }
    } catch (error) {
      return error
    }
  }

  @Mutation('deleteRoom')
  async deleteRoom(
    @Args('roomId') roomId: string
  ): Promise<boolean | ApolloError> {
    try {
      const room = await getMongoManager().findOne(RoomEntity, {
        _id: roomId,
        isActive: true
      })

      if (!room) {
        throw new ApolloError('Không tìm thấy room!')
      }

      const result = await getMongoManager().deleteOne(RoomEntity, {
        _id: roomId,
        isActive: true
      })

      if (result.deletedCount === 0) {
        throw new ApolloError('Xoá room thất bại!')
      }

      return true
    } catch (error) {
      return error
    }
  }
}

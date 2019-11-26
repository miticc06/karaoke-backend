import { Ticket as TicketEntity } from './ticket.entity'
import { Room as RoomEntity } from '../room/room.entity'
import { User as UserEntity } from '../user/user.entity'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Ticket as TicketSchema, TicketInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'
import moment = require('moment')

@Resolver('Ticket')
export class TicketResolvers {
  @ResolveProperty('createdBy')
  async resolvePropertyCreatedBy(@Parent() ticket) {
    const user = await getMongoRepository(UserEntity).findOne({
      _id: ticket.createdBy,
      isActive: true
    })
    return user
  }

  @ResolveProperty('room')
  async resolvePropertyRoom(@Parent() ticket) {
    const room = await getMongoRepository(RoomEntity).findOne({
      _id: ticket.room,
      isActive: true
    })
    return room
  }

  @Query('tickets')
  async tickets() {
    try {
      return await getMongoRepository(TicketEntity).find({})
    } catch (error) {
      return error
    }
  }

  @Query('ticket')
  async ticket(@Args('ticketId') ticketId: string) {
    try {
      const ticket = await getMongoRepository(TicketEntity).findOne({
        _id: ticketId
      })

      if (!ticket) {
        throw new ApolloError('Không tìm thấy Ticket!')
      }

      return ticket
    } catch (error) {
      return error
    }
  }

  @Mutation('createTicket')
  async createTicket(@Args('input') input: TicketInput) {
    try {
      const ticket = {
        ...input,
        createdAt: +moment(),
        createdBy: '', // TODO: find the user's ID here
        _id: uuid.v4()
      }

      // NOTE: No need to check duplicate room's ticket because a room can have several problems (sound, lighting,...)

      // const existTicket = await getMongoManager().findOne(TicketEntity, {
      //   where: {
      //     room: input.room
      //   }
      // })

      // if (existTicket) {
      //   throw new ApolloError('Ticket đã tồn tại!')
      // }

      return await getMongoManager().save(TicketEntity, ticket)
    } catch (error) {
      return error
    }
  }

  @Mutation('updateTicket')
  async updateTicket(
    @Args('ticketId') ticketId: string,
    @Args('input') input: TicketInput
  ) {
    try {
      const foundTicket = await getMongoManager().findOne(TicketEntity, {
        _id: ticketId
      })

      if (!foundTicket) {
        throw new ApolloError('Ticket không tìm thấy!')
      }

      const result = await getMongoManager().update(
        TicketEntity,
        { _id: ticketId },
        {
          ...input
        }
      )

      if (!result) {
        throw new ApolloError('Update Ticket không thành công!')
      }

      return {
        ...input,
        _id: ticketId
      }
    } catch (error) {
      return error
    }
  }

  @Mutation('deleteTicket')
  async deleteTicket(
    @Args('ticketId') ticketId: string
  ): Promise<boolean | ApolloError> {
    try {
      const ticket = await getMongoManager().findOne(TicketEntity, {
        _id: ticketId
      })

      if (!ticket) {
        throw new ApolloError('Ticket không tồn tại!')
      }

      const result = await getMongoManager().deleteOne(TicketEntity, {
        _id: ticketId
      })

      if (result.deletedCount === 0) {
        throw new ApolloError('Delete Ticket không thành công!')
      }

      return true
    } catch (error) {
      return error
    }
  }
}

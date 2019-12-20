import { Ticket as TicketEntity } from './ticket.entity'
import { Room as RoomEntity } from '../room/room.entity'
import { User as UserEntity } from '../user/user.entity'
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
  async createTicket(@Args('input') input: TicketInput, @Context() ctx) {
    try {
      if (!ctx.currentUser) {
        throw new ApolloError('Bạn chưa đăng nhập!')
      }

      const ticket = {
        ...input,
        createdAt: +moment(),
        createdBy: ctx.currentUser._id,
        _id: uuid.v4()
      }

      return await getMongoManager().save(TicketEntity, ticket)
    } catch (error) {
      return error
    }
  }

  @Mutation('updateTicket')
  async updateTicket(
    @Args('ticketId') ticketId: string,
    @Args('input') input: TicketInput,
    @Context() ctx
  ) {
    try {
      if (!ctx.currentUser) {
        throw new ApolloError('Bạn chưa đăng nhập!')
      }

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
    @Args('ticketId') ticketId: string,
    @Context() ctx
  ): Promise<boolean | ApolloError> {
    try {
      if (!ctx.currentUser) {
        throw new ApolloError('Bạn chưa đăng nhập!')
      }
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

import { TypeRoom as TypeRoomEntity } from './typeroom.entity'
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { TypeRoom as TypeRoomSchema, TypeRoomInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'

@Resolver('TypeRoom')
export class TypeRoomResolvers {
  @Query('typeroom')
  async typeroom(
    @Args('typeroomId') typeroomId: string
  ): Promise<TypeRoomSchema | ApolloError> {
    try {
      const typeroom = await getMongoRepository(TypeRoomEntity).findOne({
        _id: typeroomId
      })

      if (!typeroom) {
        throw new ApolloError('Không tìm thấy TypeRoom!')
      }

      return typeroom
    } catch (error) {
      return error
    }
  }

  @Query('typerooms')
  async typerooms(): Promise<TypeRoomSchema[] | ApolloError> {
    try {
      return await getMongoRepository(TypeRoomEntity).find({})
    } catch (error) {
      return error
    }
  }

  @Mutation('createTypeRoom')
  async createTypeRoom(
    @Args('input') input: TypeRoomInput
  ): Promise<TypeRoomSchema | ApolloError> {
    try {
      const typeroom = {
        ...input,
        _id: uuid.v4()
      }

      const existTypeRoom = await getMongoManager().findOne(TypeRoomEntity, {
        name: input.name
      })

      if (existTypeRoom) {
        throw new ApolloError('Name của typeroom này đã được sử dụng!')
      }

      return await getMongoManager().save(TypeRoomEntity, typeroom)
    } catch (error) {
      return error
    }
  }

  @Mutation('updateTypeRoom')
  async updateTypeRoom(
    @Args('typeroomId') typeroomId: string,
    @Args('input') input: TypeRoomInput
  ): Promise<TypeRoomSchema | ApolloError> {
    try {
      const foundTypeRoom = await getMongoManager().findOne(TypeRoomEntity, {
        _id: typeroomId
      })

      if (!foundTypeRoom) {
        throw new ApolloError('typeroom không tìm thấy!')
      }

      const existTypeRoom = await getMongoManager().findOne(TypeRoomEntity, {
        where: {
          $and: [
            {
              _id: {
                $ne: typeroomId
              }
            },
            {
              name: input.name
            }
          ]
        }
      })

      if (existTypeRoom) {
        throw new ApolloError('Name typeroom này đã được sử dụng!')
      }

      const result = await getMongoManager().update(
        TypeRoomEntity,
        { _id: typeroomId },
        {
          ...input
        }
      )

      if (!result) {
        throw new ApolloError('Update typeroom không thành công!')
      }

      return {
        ...input,
        _id: typeroomId
      }
    } catch (error) {
      return error
    }
  }

  @Mutation('deleteTypeRoom')
  async deleteTypeRoom(
    @Args('typeroomId') typeroomId: string
  ): Promise<boolean | ApolloError> {
    try {
      const typeroom = await getMongoManager().findOne(TypeRoomEntity, {
        _id: typeroomId
      })

      if (!typeroom) {
        throw new ApolloError('Không tìm thấy typeroom!')
      }

      const result = await getMongoManager().deleteOne(TypeRoomEntity, {
        _id: typeroomId
      })

      if (result.deletedCount === 0) {
        throw new ApolloError('Xoá typeroom thất bại!')
      }

      return true
    } catch (error) {
      return error
    }
  }
}

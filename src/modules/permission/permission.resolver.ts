import { Permission as PermissionEntity } from './permission.entity'
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Permission as PermissionSchema, PermissionInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'

@Resolver('Permission')
export class PermissionResolvers {
  @Query('permissions')
  async permissions(): Promise<PermissionSchema[] | ApolloError> {
    try {
      return await getMongoRepository(PermissionEntity).find({})
    } catch (error) {
      return error
    }
  }

  @Mutation('createPermission')
  async createPermission(
    @Args('input') input: PermissionInput
  ): Promise<PermissionSchema | ApolloError> {
    try {
      const permission = {
        ...input,
        _id: uuid.v4()
      }

      const existPermission = await getMongoManager().findOne(PermissionEntity, {
        where: {
          $or: [
            {
              name: input.name
            },
            {
              code: input.code
            }
          ]
        }
      })

      if (existPermission) {
        throw new ApolloError('Name hoặc code permission này đã được sử dụng!')
      }

      return await getMongoManager().save(PermissionEntity, permission)
    } catch (error) {
      return error
    }
  }

  @Mutation('updatePermission')
  async updatePermission(
    @Args('permissionId') permissionId: string,
    @Args('input') input: PermissionInput
  ): Promise<PermissionSchema | ApolloError> {
    try {
      const foundPermission = await getMongoManager().findOne(PermissionEntity, {
        _id: permissionId
      })

      if (!foundPermission) {
        throw new ApolloError('permission not found!')
      }

      const existPermission = await getMongoManager().findOne(PermissionEntity, {
        where: {
          $and: [
            {
              _id: {
                $ne: permissionId
              }
            },
            {
              $or: [
                {
                  name: input.name
                },
                {
                  code: input.code
                }
              ]
            }
          ]
        }
      })

      if (existPermission) {
        throw new ApolloError('Name hoặc code permission này đã được sử dụng!')
      }

      const result = await getMongoManager().update(
        PermissionEntity,
        { _id: permissionId },
        {
          ...input
        }
      )

      if (!result) {
        throw new ApolloError('Update permission không thành công!')
      }

      return {
        ...input,
        _id: permissionId
      }
    } catch (error) {
      return error
    }
  }

  @Mutation('deletePermission')
  async deletePermission(
    @Args('permissionId') permissionId: string
  ): Promise<boolean | ApolloError> {
    try {
      const permission = await getMongoManager().findOne(PermissionEntity, {
        _id: permissionId
      })

      if (!permission) {
        throw new ApolloError('Không tìm thấy permission! ')
      }

      const result = await getMongoManager().deleteOne(PermissionEntity, {
        _id: permissionId
      })

      if (result.deletedCount === 0) {
        throw new ApolloError('Xóa permission thất bại!')
      }

      return true
    } catch (error) {
      return error
    }
  }
}

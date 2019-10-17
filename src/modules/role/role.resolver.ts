import { Role as RoleEntity } from './role.entity'
import { Permission as PermissionEntity } from '../permission/permission.entity'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { RoleInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'

@Resolver('Role')
export class RoleResolvers {
  @ResolveProperty('permissions')
  async resolvePropertyPermissions(@Parent() role) {
    const permissions = await Promise.all(
      role.permissions.map(async permissionId => {
        return await getMongoRepository(PermissionEntity).findOne({
          _id: permissionId
        })
      })
    )
    return permissions
  }

  @Query('roles')
  async roles() {
    try {
      return await getMongoRepository(RoleEntity).find({})
    } catch (error) {
      return error
    }
  }

  @Query('role')
  async role(@Args('roleId') roleId: string) {
    try {
      const role = await getMongoRepository(RoleEntity).findOne({
        _id: roleId
      })

      if (!role) {
        throw new ApolloError('Không tìm thấy Role!')
      }

      return role
    } catch (error) {
      return error
    }
  }

  @Mutation('createRole')
  async createRole(@Args('input') input: RoleInput) {
    try {
      const role = {
        ...input,
        _id: uuid.v4()
      }
      const existRole = await getMongoManager().findOne(RoleEntity, {
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
      if (existRole) {
        throw new ApolloError('Name hoặc code role này đã được sử dụng!')
      }
      return await getMongoManager().save(RoleEntity, role)
    } catch (error) {
      return error
    }
  }

  @Mutation('updateRole')
  async updateRole(
    @Args('roleId') roleId: string,
    @Args('input') input: RoleInput
  ) {
    try {
      const foundRole = await getMongoManager().findOne(RoleEntity, {
        _id: roleId
      })

      if (!foundRole) {
        throw new ApolloError('role not found!')
      }

      const existRole = await getMongoManager().findOne(RoleEntity, {
        where: {
          $and: [
            {
              _id: {
                $ne: roleId
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

      if (existRole) {
        throw new ApolloError('Name hoặc code role này đã được sử dụng!')
      }

      const result = await getMongoManager().update(
        RoleEntity,
        { _id: roleId },
        {
          ...input
        }
      )

      if (!result) {
        throw new ApolloError('Update role không thành công!')
      }

      return {
        ...input,
        _id: roleId
      }
    } catch (error) {
      return error
    }
  }

  @Mutation('deleteRole')
  async deleteRole(
    @Args('roleId') roleId: string
  ): Promise<boolean | ApolloError> {
    try {
      const role = await getMongoManager().findOne(RoleEntity, {
        _id: roleId
      })

      if (!role) {
        throw new ApolloError('Không tìm thấy role! ')
      }

      const result = await getMongoManager().deleteOne(RoleEntity, {
        _id: roleId
      })

      if (result.deletedCount === 0) {
        throw new ApolloError('Xóa role thất bại!')
      }

      return true
    } catch (error) {
      return error
    }
  }
}

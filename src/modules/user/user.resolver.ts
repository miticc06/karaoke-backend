import { User as UserEntity } from './user.entity'
import { Role as RoleEntity } from '../role/role.entity'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { UserCreateInput, UserUpdateInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as moment from 'moment'

const PRIVATE_KEY = 'privateKey@12345678'

@Resolver('User')
export class UserResolvers {
  @ResolveProperty('role')
  async resolvePropertyRole(@Parent() user) {
    const role = await getMongoRepository(RoleEntity).findOne({
      _id: user.role
    })
    return role
  }

  @Query('users')
  async roles() {
    try {
      return await getMongoRepository(UserEntity).find({
        isActive: true
      })
    } catch (error) {
      return error
    }
  }

  @Query('user')
  async role(@Args('id') userId: string) {
    try {
      const role = await getMongoRepository(UserEntity).findOne({
        _id: userId,
        isActive: true
      })

      if (!role) {
        throw new ApolloError('Không tìm thấy User!')
      }

      return role
    } catch (error) {
      return error
    }
  }

  @Mutation('createUser')
  async createRole(@Args('input') createInput: UserCreateInput) {
    const { username, password, email, name, roleId } = createInput
    try {
      if (!/^[a-z0-9_-]{3,}$/gim.test(username)) {
        throw new ApolloError(
          'Username không hợp lệ (Chỉ nên bao gồm chữ cái và số)!'
        )
      }

      if (password.length === 0) {
        throw new ApolloError('Vui lòng nhập password!')
      }

      if (
        !/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm.test(
          email
        )
      ) {
        throw new ApolloError('Email không hợp lệ!')
      }

      const exist = await getMongoManager().findOne(UserEntity, {
        where: {
          $and: [
            {
              $or: [
                {
                  username: username.toLocaleLowerCase()
                },
                {
                  email
                }
              ]
            },
            {
              isActive: true
            }
          ]
        }
      })
      if (exist) {
        throw new ApolloError('Username hoặc email đã được sử dụng!')
      }

      const passwordHashed = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      const user = {
        username: username.toLocaleLowerCase(),
        password: passwordHashed,
        email,
        name,
        role: roleId,
        createdAt: +moment(),
        isActive: true,
        _id: uuid.v4()
      }

      return await getMongoManager().save(UserEntity, user)
    } catch (error) {
      return error
    }
  }

  @Mutation('login')
  async login(
    @Args('username') username: string,
    @Args('password') password: string
  ) {
    try {
      const user = await getMongoManager().findOne(UserEntity, {
        username: username.toLocaleLowerCase(),
        isActive: true
      })

      if (!user) {
        throw new ApolloError('Tên đăng nhập hoặc mật khẩu không chính xác!')
      }

      // if (!user.isActive) {
      //   throw new ApolloError('Tài khoản này đã bị khóa!')
      // }

      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        throw new ApolloError('Tên đăng nhập hoặc mật khẩu không chính xác!')
      }

      const token = jwt.sign({ userId: user._id, username }, PRIVATE_KEY)
      return { token }
    } catch (error) {
      return error
    }
  }

  @Mutation('updateUser')
  async updateUser(
    @Args('userId') userId: string,
    @Args('input') input: UserUpdateInput
  ) {
    try {
      const user = await getMongoManager().findOne(UserEntity, {
        _id: userId,
        isActive: true
      })

      if (!user) {
        throw new ApolloError('user not found!')
      }

      // TODO: CHECK email trùng

      const { currentPassword, newPassword, email, name, roleId } = input
      if (currentPassword && newPassword) {
        const match = await bcrypt.compare(currentPassword, user.password)
        if (!match) {
          throw new ApolloError('Mật khẩu cũ không chính xác')
        }
        user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))
      }

      if (email) {
        user.email = email
      }

      if (name) {
        user.name = name
      }

      if (roleId) {
        user.role = roleId
      }

      const result = await getMongoManager().update(
        UserEntity,
        { _id: userId },
        {
          ...user
        }
      )
      if (!result) {
        throw new ApolloError('Update user thất bại!')
      }
      return true
    } catch (error) {
      return error
    }
  }

  @Mutation('deleteUser')
  async deleteRole(
    @Args('userId') userId: string
  ): Promise<boolean | ApolloError> {
    try {
      const user = await getMongoManager().findOne(UserEntity, {
        _id: userId,
        isActive: true
      })

      if (!user) {
        throw new ApolloError('Không tìm thấy User!')
      }

      await getMongoManager().update(
        UserEntity,
        {
          _id: userId
        },
        {
          isActive: false
        }
      )

      return true
    } catch (error) {
      return error
    }
  }
}

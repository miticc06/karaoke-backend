import { Permission as PermissionEntity } from './permission.entity'
import { Query, Context, Resolver } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { getMongoRepository } from 'typeorm'
import { Permission as PermissionSchema } from 'src/graphql'

@Resolver('Permission')
export class PermissionResolver {
  @Query('permissions')
  async permissions(): Promise<PermissionSchema[] | ApolloError> {
    try {
      const xx = 'Đặng Msaaz'
      console.log(xx)
      // const permissions = await getMongoRepository(PermissionEntity).find({})
      return [
        {
          _id: '12121',
          code: '12dasb djbasd bajsd ',
          name: xx
        }
      ]
    } catch (error) {
      return error
    }
  }
}

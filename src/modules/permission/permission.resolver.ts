// import { Permission as PermissionEntity } from './permission.entity'
import { Query, Context, Resolver } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Permission } from 'src/graphql'
// import { getMongoRepository } from 'typeorm'

@Resolver('Permission')
export class PermissionResolvers {
  @Query('permissions')
  async permissions(): Promise<Permission[] | ApolloError> {
    try {
      const xx = 'dk asdklansklnas dkl'
      console.log(xx)
      // const permissions = await getMongoRepository(PermissionEntity).find({})
      return [
        {
          _id: 'xxxxx 321',
          code: '12dasb dsssss ',
          name: xx
        }
      ]
    } catch (error) {
      return error
    }
  }
}

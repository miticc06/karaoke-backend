import { Service as ServiceEntity } from './service.entity'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Service as ServiceSchema, ServiceInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'

@Resolver('Service')
export class ServiceResolvers {
  // @Query('services')
  // async services() {
  //   try {
  //     return await getMongoRepository(ServiceEntity).find({})
  //   } catch (error) {
  //     return error
  //   }
  // }

  @Query('services')
  async services(): Promise<ServiceSchema[] | ApolloError> {
    try {
      return await getMongoRepository(ServiceEntity).find({})
    } catch (error) {
      return error
    }
  }
  @Query('service')
  async service(@Args('serviceId') serviceId: string) {
    try {
      const service = await getMongoRepository(ServiceEntity).findOne({
        _id: serviceId
      })

      if (!service) {
        throw new ApolloError('Không tìm thấy Service!')
      }

      return service
    } catch (error) {
      return error
    }
  }

  @Mutation('createService')
  async createService(
    @Args('input') input: ServiceInput
  ): Promise<ServiceSchema | ApolloError> {
    try {
      const service = {
        ...input,
        _id: uuid.v4()
      }

      // const existService = await getMongoManager().findOne(ServiceEntity, {
      //   where: {
      //     name: input.name
      //   }
      // })

      // if (existService) {
      //   throw new ApolloError('Name cho service này đã được sử dụng!')
      // }

      return await getMongoManager().save(ServiceEntity, service)
    } catch (error) {
      return error
    }
  }

  @Mutation('updateService')
  async updateService(
    @Args('serviceId') serviceId: string,
    @Args('input') input: ServiceInput
  ): Promise<ServiceSchema | ApolloError> {
    try {
      const foundService = await getMongoManager().findOne(ServiceEntity, {
        _id: serviceId
      })

      if (!foundService) {
        throw new ApolloError('Service not found!')
      }

      // const existService = await getMongoManager().findOne(ServiceEntity, {
      //   where: {
      //     $and: [
      //       {
      //         _id: {
      //           $ne: serviceId
      //         }
      //       },
      //       {
      //         name: input.name
      //       }
      //     ]
      //   }
      // })

      // if (existService) {
      //   throw new ApolloError('Name hoặc code Service này đã được sử dụng!')
      // }

      const result = await getMongoManager().update(
        ServiceEntity,
        { _id: serviceId },
        {
          ...input
        }
      )

      if (!result) {
        throw new ApolloError('Update Service không thành công!')
      }

      return {
        ...input,
        _id: serviceId
      }
    } catch (error) {
      return error
    }
  }

  @Mutation('deleteService')
  async deleteService(
    @Args('serviceId') serviceId: string
  ): Promise<boolean | ApolloError> {
    try {
      const service = await getMongoManager().findOne(ServiceEntity, {
        _id: serviceId
      })

      if (!service) {
        throw new ApolloError('Không tìm thấy Service! ')
      }

      const result = await getMongoManager().deleteOne(ServiceEntity, {
        _id: serviceId
      })

      if (result.deletedCount === 0) {
        throw new ApolloError('Xóa Service thất bại!')
      }

      return true
    } catch (error) {
      return error
    }
  }
}

import { Customer as CustomerEntity } from './customer.entity'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Customer as CustomerSchema, CustomerInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'

@Resolver('Customer')
export class CustomerResolvers {
  @Query('customers')
  async customers(): Promise<CustomerSchema[] | ApolloError> {
    try {
      return await getMongoRepository(CustomerEntity).find({})
    } catch (error) {
      return error
    }
  }
  @Query('customer')
  async customer(@Args('customerId') customerId: string) {
    try {
      const customer = await getMongoRepository(CustomerEntity).findOne({
        _id: customerId
      })

      if (!customer) {
        throw new ApolloError('Không tìm thấy Khach Hang!')
      }

      return customer
    } catch (error) {
      return error
    }
  }

  @Mutation('createCustomer')
  async createCustomer(
    @Args('input') input: CustomerInput
  ): Promise<CustomerSchema | ApolloError> {
    try {
      const customer = {
        ...input,
        _id: uuid.v4()
      }

      return await getMongoManager().save(CustomerEntity, customer)
    } catch (error) {
      return error
    }
  }

  @Mutation('updateCustomer')
  async updateCustomer(
    @Args('customerId') customerId: string,
    @Args('input') input: CustomerInput
  ): Promise<CustomerSchema | ApolloError> {
    try {
      const foundCustomer = await getMongoManager().findOne(CustomerEntity, {
        _id: customerId
      })

      if (!foundCustomer) {
        throw new ApolloError('Customer not found!')
      }

      const result = await getMongoManager().update(
        CustomerEntity,
        { _id: customerId },
        {
          ...input
        }
      )

      if (!result) {
        throw new ApolloError('Update customer không thành công!')
      }

      return {
        ...input,
        _id: customerId
      }
    } catch (error) {
      return error
    }
  }

  @Mutation('deleteCustomer')
  async deleteCustomer(
    @Args('customerId') customerId: string
  ): Promise<boolean | ApolloError> {
    try {
      const customer = await getMongoManager().findOne(CustomerEntity, {
        _id: customerId
      })

      if (!customer) {
        throw new ApolloError('Không tìm thấy customer! ')
      }

      const result = await getMongoManager().deleteOne(CustomerEntity, {
        _id: customerId
      })

      if (result.deletedCount === 0) {
        throw new ApolloError('Xóa Customer thất bại!')
      }

      return true
    } catch (error) {
      return error
    }
  }
}

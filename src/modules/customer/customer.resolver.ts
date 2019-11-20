import { Customer as CustomerEntity } from './customer.entity'
import { Query, Resolver, Mutation, Args } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Customer as CustomerSchema, CustomerInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'
import moment from 'moment'

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
  async customer(@Args('id') customerId: string) {
    try {
      const customer = await getMongoRepository(CustomerEntity).findOne({
        _id: customerId
      })

      if (!customer) {
        throw new ApolloError('Không tìm thấy khách hàng!')
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
    const { phone, email } = input

    const exist = await getMongoManager().findOne(CustomerEntity, {
      where: {
        $and: [
          {
            $or: [
              {
                phone
              }
            ]
          }
        ]
      }
    })
    if (exist) {
      throw new ApolloError('Khách hàng này đã tồn tại!')
    }

    try {
      const customer = {
        ...input,
        createdAt: +moment(),
        points: 0,
        _id: uuid.v4()
      }

      return await getMongoManager().save(CustomerEntity, customer)
    } catch (error) {
      return error
    }
  }

  @Mutation('updateCustomer')
  async updateCustomer(
    @Args('id') customerId: string,
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
        throw new ApolloError('Update customer thất bại!')
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

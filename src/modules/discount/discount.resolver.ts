import { Discount as DiscountEntity } from './discount.entity'
import { User as UserEntity } from '../user/user.entity'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { Discount as DiscountSchema, DiscountInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'

@Resolver('Discount')
export class DiscountResolvers {
  @ResolveProperty('createdBy')
  async resolvePropertyCreatedBy(@Parent() discount) {
    const user = await getMongoRepository(UserEntity).findOne({
      _id: discount.createdBy
    })
    return user
  }

  @Query('discounts')
  async discounts() {
    try {
      return await getMongoRepository(DiscountEntity).find({
        isActive: true
      })
    } catch (error) {
      return error
    }
  }

  @Query('discount')
  async discount(@Args('discountId') discountId: string) {
    try {
      const discount = await getMongoRepository(DiscountEntity).findOne({
        _id: discountId,
        isActive: true
      })

      if (!discount) {
        throw new ApolloError('Không tìm thấy Discount!')
      }

      return discount
    } catch (error) {
      return error
    }
  }

  @Mutation('createDiscount')
  async createDiscount(@Args('input') input: DiscountInput) {
    try {
      const discount = {
        ...input,
        isActive: true,
        _id: uuid.v4()
      }
      const existDiscount = await getMongoManager().findOne(DiscountEntity, {
        where: {
          $and: [
            {
              name: input.name
            },
            {
              startDate: input.startDate
            },
            {
              endDate: input.endDate
            }
          ]
        }
      })

      if (existDiscount) {
        throw new ApolloError('Discount đã tồn tại!')
      }

      return await getMongoManager().save(DiscountEntity, discount)
    } catch (error) {
      return error
    }
  }

  @Mutation('updateDiscount')
  async updateDiscount(
    @Args('discountId') discountId: string,
    @Args('input') input: DiscountInput
  ) {
    try {
      const foundDiscount = await getMongoManager().findOne(DiscountEntity, {
        _id: discountId,
        isActive: true
      })

      if (!foundDiscount) {
        throw new ApolloError('Discount không tìm thấy!')
      }

      const existDiscount = await getMongoManager().findOne(DiscountEntity, {
        where: {
          $and: [
            {
              _id: {
                $ne: discountId
              }
            },
            {
              name: input.name
            },
            {
              startDate: input.startDate
            },
            {
              endDate: input.endDate
            }
          ]
        }
      })

      if (existDiscount) {
        throw new ApolloError('Discount này đã tồn tại!')
      }

      const result = await getMongoManager().update(
        DiscountEntity,
        { _id: discountId },
        {
          ...input
        }
      )

      if (!result) {
        throw new ApolloError('Update Discount không thành công!')
      }

      return {
        ...input,
        _id: discountId
      }
    } catch (error) {
      return error
    }
  }

  @Mutation('deleteDiscount')
  async deleteDiscount(
    @Args('discountId') discountId: string
  ): Promise<boolean | ApolloError> {
    try {
      const discount = await getMongoManager().findOne(DiscountEntity, {
        _id: discountId,
        isActive: true
      })

      if (!discount) {
        throw new ApolloError('Discount không tồn tại!')
      }

      const result = await getMongoManager().update(
        DiscountEntity,
        {
          _id: discountId
        },
        {
          isActive: false
        }
      )

      if (!result) {
        throw new ApolloError('Delete Discount không thành công!')
      }

      return true
    } catch (error) {
      return error
    }
  }
}

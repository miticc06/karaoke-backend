import { PaymentSlip as PaymentSlipEntity } from './payment-slip.entity'
import { User as UserEntity } from '../user/user.entity'
import {
  Query,
  Resolver,
  Mutation,
  Args,
  ResolveProperty,
  Parent,
  Context
} from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'
import { PaymentSlip as PaymentSlipSchema, PaymentSlipInput } from 'src/graphql'
import { getMongoRepository, getMongoManager } from 'typeorm'

import * as uuid from 'uuid'
import moment = require('moment')

@Resolver('PaymentSlip')
export class PaymentSlipResolvers {
  @ResolveProperty('createdBy')
  async resolvePropertyCreatedBy(@Parent() paymentSlip) {
    const user = await getMongoRepository(UserEntity).findOne({
      _id: paymentSlip.createdBy
    })
    return user
  }

  @Query('paymentSlips')
  async paymentSlips() {
    try {
      return await getMongoRepository(PaymentSlipEntity).find({})
    } catch (error) {
      return error
    }
  }

  @Query('paymentSlip')
  async paymentSlip(@Args('paymentSlipId') paymentSlipId: string) {
    try {
      const paymentSlip = await getMongoRepository(PaymentSlipEntity).findOne({
        _id: paymentSlipId
      })

      if (!paymentSlip) {
        throw new ApolloError('Không tìm thấy Payment Slip!')
      }

      return paymentSlip
    } catch (error) {
      return error
    }
  }

  @Mutation('createPaymentSlip')
  async createPaymentSlip(
    @Args('input') input: PaymentSlipInput,
    @Context() context
  ) {
    try {
      // find the current user's id here

      const paymentSlip = {
        ...input,
        createdAt: +moment(),
        createdBy: context.currentUser._id,
        _id: uuid.v4()
      }

      return await getMongoManager().save(PaymentSlipEntity, paymentSlip)
    } catch (error) {
      return error
    }
  }

  @Mutation('updatePaymentSlip')
  async updatePaymentSlip(
    @Args('paymentSlipId') paymentSlipId: string,
    @Args('input') input: PaymentSlipInput
  ) {
    try {
      const foundPaymentSlip = await getMongoManager().findOne(
        PaymentSlipEntity,
        {
          _id: paymentSlipId
        }
      )

      if (!foundPaymentSlip) {
        throw new ApolloError('Payment Slip không tìm thấy!')
      }

      const result = await getMongoManager().update(
        PaymentSlipEntity,
        { _id: paymentSlipId },
        {
          ...input
        }
      )

      if (!result) {
        throw new ApolloError('Update Payment Slip không thành công!')
      }

      return {
        ...input,
        _id: paymentSlipId
      }
    } catch (error) {
      return error
    }
  }

  @Mutation('deletePaymentSlip')
  async deletePaymentSlip(
    @Args('paymentSlipId') paymentSlipId: string
  ): Promise<boolean | ApolloError> {
    try {
      const paymentSlip = await getMongoManager().findOne(PaymentSlipEntity, {
        _id: paymentSlipId
      })

      if (!paymentSlip) {
        throw new ApolloError('Payment Slip không tồn tại!')
      }

      const result = await getMongoManager().deleteOne(PaymentSlipEntity, {
        _id: paymentSlipId
      })

      if (result.deletedCount === 0) {
        throw new ApolloError('Xoá Payment Slip thất bại!')
      }

      return true
    } catch (error) {
      return error
    }
  }
}

import { Query, Resolver, Args, ResolveProperty } from '@nestjs/graphql'
import { getMongoRepository } from 'typeorm'
import { Bill as BillEntity } from '../bill/bill.entity'
import { PaymentSlip as PaymentSlipEntity } from '../payment-slip/payment-slip.entity'
import moment = require('moment')

@Resolver('Report')
export class ReportResolvers {
  @Query('ReportRevenueRooms')
  async ReportRevenueRooms(
    @Args('startDate') startDate: number,
    @Args('endDate') endDate: number
  ) {
    try {
      const res = await getMongoRepository(BillEntity).find({
        where: {
          $and: [
            {
              state: 20
            },
            {
              createdAt: {
                $gte: startDate
              }
            },
            {
              createdAt: {
                $lte: endDate
              }
            }
          ]
        }
      })
      return res
    } catch (error) {
      return error
    }
  }

  @Query('ReportRevenueServices')
  async ReportRevenueServices(
    @Args('startDate') startDate: number,
    @Args('endDate') endDate: number
  ) {
    try {
      const data = await getMongoRepository(BillEntity).find({
        where: {
          $and: [
            {
              state: 20
            },
            {
              createdAt: {
                $gte: startDate
              }
            },
            {
              createdAt: {
                $lte: endDate
              }
            }
          ]
        }
      })

      const hash = {}

      data.map(bill => {
        bill.serviceDetails.map(serviceDetail => {
          // hash[serviceDetail.service._id] = 1
          if (!hash[serviceDetail.service._id]) {
            hash[serviceDetail.service._id] = {
              serviceId: serviceDetail.service._id,
              name: serviceDetail.service.name,
              type: serviceDetail.service.type,
              unitPrice: serviceDetail.service.unitPrice,
              quantity:
                serviceDetail.service.type === 'perUNIT'
                  ? serviceDetail.quantity
                  : serviceDetail.endTime - serviceDetail.startTime,
              total: serviceDetail.total
            }
            console.log('xxxx', serviceDetail, hash[serviceDetail.service._id])
          } else {
            hash[serviceDetail.service._id] = {
              ...hash[serviceDetail.service._id],
              quantity:
                serviceDetail.service.type === 'perUNIT'
                  ? hash[serviceDetail.service._id].quantity +
                    serviceDetail.quantity
                  : hash[serviceDetail.service._id].quantity +
                    serviceDetail.endTime -
                    serviceDetail.startTime,
              total: hash[serviceDetail.service._id].total + serviceDetail.total
            }
          }
        })
      })
      console.log(hash)
      const res = []

      // tslint:disable-next-line:forin
      for (const key in hash) {
        res.push(hash[key])
      }

      return res.sort((aa, bb) => (aa.total < bb.total ? 1 : -1))
      // .map(obj => ({ ...obj, total: obj.unitPrice * obj.quantity }))
    } catch (error) {
      return error
    }
  }

  @Query('ReportThuChiTongHop')
  async ReportThuChiTongHop(
    @Args('startDate') startDate: number,
    @Args('endDate') endDate: number
  ) {
    const data = await getMongoRepository(PaymentSlipEntity).find({
      where: {
        $and: [
          {
            createdAt: {
              $gte: startDate
            }
          },
          {
            createdAt: {
              $lte: endDate
            }
          }
        ]
      }
    })

    const res = [
      ...data.map(pay => ({
        name: `${pay.description} (${moment(pay.createdAt).format(
          'DD/MM/YYYY HH:MM'
        )}))`,
        total: pay.price,
        type: 'CHI'
      }))
    ]

    const ReportRevenueRooms = await this.ReportRevenueRooms(startDate, endDate)
    console.log()
    res.push({
      name: `Doanh thu tiền phòng từ ${moment(startDate).format(
        'DD/MM/YYYY'
      )} đến ${moment(endDate).format('DD/MM/YYYY')}`,
      type: 'THU',
      total: ReportRevenueRooms.reduce((total, obj) => total + obj.total, 0)
    })
    return res
  }
}

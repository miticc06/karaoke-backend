import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'paymentSlips' })
export class PaymentSlip {
  @ObjectIdColumn()
  _id: string

  @Column()
  description: string

  @Column()
  price: number

  @Column()
  createdAt: number

  @Column()
  createdBy: string
}

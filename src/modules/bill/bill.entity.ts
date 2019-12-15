import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'bill' })
export class Bill {
  @ObjectIdColumn()
  _id: string

  @Column()
  customer: string

  @Column()
  createdAt: number

  @Column()
  createdBy: string

  @Column()
  state: number

  @Column()
  roomDetails: any

  @Column()
  serviceDetails: any

  @Column()
  total: number
}

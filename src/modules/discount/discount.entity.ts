import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'discount' })
export class Discount {
  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @Column()
  type: string

  @Column()
  value: number

  @Column()
  createdAt: number

  @Column()
  createdBy: string

  @Column()
  startDate: number

  @Column()
  endDate: number

  @Column()
  isActive: boolean
}

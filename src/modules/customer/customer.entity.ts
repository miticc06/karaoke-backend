import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'customers' })
export class Customer {
  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @Column()
  dateOfBirth: number

  @Column()
  phone: string

  @Column()
  email: string

  @Column()
  points: number
}

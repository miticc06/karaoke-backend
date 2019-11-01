import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'typeroom' })
export class TypeRoom {
  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @Column()
  unitPrice: number

  @Column()
  updatedAt: number
}

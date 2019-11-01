import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'services' })
export class Service {
  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @Column()
  unitPrice: number

  @Column()
  typeService: string
}

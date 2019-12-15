import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'services' })
export class Service {
  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  /**
   * perHOUR: Theo giờ.
   * perUNIT: Theo lượt.
   */
  @Column()
  unitPrice: number

  @Column()
  type: string
}

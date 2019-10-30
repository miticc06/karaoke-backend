import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'rooms' })
export class Room {
  @ObjectIdColumn()
  _id: string

  @Column()
  name: string

  @Column()
  createdAt: number

  @Column()
  typeRoom: string

  @Column()
  isActive: boolean
}

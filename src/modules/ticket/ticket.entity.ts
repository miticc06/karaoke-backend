import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'ticket' })
export class Ticket {
  @ObjectIdColumn()
  _id: string

  @Column()
  subject: string

  @Column()
  room: string

  @Column()
  status: string

  @Column()
  createdAt: number

  @Column()
  createdBy: string
}

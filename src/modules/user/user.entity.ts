import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'user' })
export class User {
  @ObjectIdColumn()
  _id: string

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  email: string

  @Column()
  name: string

  @Column()
  createdAt: number

  @Column()
  role: string

  @Column()
  isActive: boolean
}

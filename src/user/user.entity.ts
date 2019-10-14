import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'users' })
export class User {
  @ObjectIdColumn()
  id: ObjectID

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

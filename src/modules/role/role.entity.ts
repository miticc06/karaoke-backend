import { Column, Entity, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'roles' })
export class Role {
  @ObjectIdColumn()
  _id: string

  @Column()
  code: string

  @Column()
  name: string

  @Column()
  permissions: string[]
}

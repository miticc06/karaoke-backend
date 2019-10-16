import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'permissions' })
export class Permission {
  @ObjectIdColumn()
  _id: string

  @Column()
  code: string

  @Column()
  name: string
}

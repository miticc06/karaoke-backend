import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'permissions' })
export class Permission {
  @ObjectIdColumn()
  _id: ObjectID

  @Column()
  code: string

  @Column()
  name: string
}

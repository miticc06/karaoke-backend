import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm'

@Entity({ name: 'Photo' })
export class Photo {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	name: string

	@Column()
	description: string

	@Column()
	filename: string

	@Column()
	isPublished: boolean
}

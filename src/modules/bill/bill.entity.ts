import { Column, Entity, ObjectIdColumn } from 'typeorm'
import { Room } from '../room/room.entity'

@Entity({ name: 'bill' })
export class Bill {
  @ObjectIdColumn()
  _id: string

  @Column()
  customer: string

  @Column()
  createdAt: number

  @Column()
  createdBy: string

  /**
   * state 0: Đã hủy
   * state 10: Đang còn sử dụng
   * state 20: Đã hoàn thành
   */
  @Column()
  state: number

  @Column()
  roomDetails: any[] // any

  @Column()
  serviceDetails: any[]

  @Column()
  total: number
}

// class BillRoomDetailsInput {
//   // room: string
//   room: any
//   startTime: string
//   endTime: string
//   total: number
// }

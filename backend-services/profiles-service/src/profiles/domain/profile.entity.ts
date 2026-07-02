import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Gender } from '../enum/gender.enum'

@Entity('profiles')
export class Profile {
  // randomuser.me login.uuid — the stable identifier for a profile.
  @PrimaryColumn('uuid')
  id!: string

  @Column({ name: 'first_name' })
  firstName!: string

  @Column({ name: 'last_name' })
  lastName!: string

  @Column({ type: 'varchar' })
  gender!: Gender

  @Column({ type: 'int' })
  age!: number

  @Column({ name: 'year_of_birth', type: 'int' })
  yearOfBirth!: number

  @Column()
  email!: string

  @Column()
  phone!: string

  @Column({ name: 'picture_url' })
  pictureUrl!: string

  @Column()
  country!: string

  @Column()
  city!: string

  @Column()
  state!: string

  @Column()
  street!: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

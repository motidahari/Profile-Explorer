import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Profile } from './domain/profile.entity'
import { CreateProfileDto } from './dto/create-profile.dto'

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly repo: Repository<Profile>,
  ) {}

  findAll(): Promise<Profile[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } })
  }

  findById(id: string): Promise<Profile | null> {
    return this.repo.findOne({ where: { id } })
  }

  create(dto: CreateProfileDto): Promise<Profile> {
    const profile = this.repo.create(dto)
    return this.repo.save(profile)
  }

  updateName(profile: Profile, firstName: string, lastName: string): Promise<Profile> {
    profile.firstName = firstName
    profile.lastName = lastName
    return this.repo.save(profile)
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id)
    return (result.affected ?? 0) > 0
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { ProfilesRepository } from './profiles.repository'
import { Profile } from './domain/profile.entity'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { RandomProfile, RandomProfileProvider } from './providers/random-profile.provider'

const RANDOM_PROFILE_COUNT = 10

@Injectable()
export class ProfilesService {
  constructor(
    private readonly repository: ProfilesRepository,
    private readonly randomProfileProvider: RandomProfileProvider,
  ) {}

  findAll(): Promise<Profile[]> {
    return this.repository.findAll()
  }

  fetchRandom(): Promise<RandomProfile[]> {
    return this.randomProfileProvider.fetchRandom(RANDOM_PROFILE_COUNT)
  }

  async create(dto: CreateProfileDto): Promise<Profile> {
    const existing = await this.repository.findById(dto.id)
    if (existing) {
      throw new ConflictException(`Profile with id "${dto.id}" already exists`)
    }
    return this.repository.create(dto)
  }

  async update(id: string, dto: UpdateProfileDto): Promise<Profile> {
    const existing = await this.repository.findById(id)
    if (!existing) {
      throw new NotFoundException(`Profile with id "${id}" not found`)
    }
    return this.repository.updateName(
      existing,
      dto.firstName ?? existing.firstName,
      dto.lastName ?? existing.lastName,
    )
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repository.delete(id)
    if (!deleted) {
      throw new NotFoundException(`Profile with id "${id}" not found`)
    }
  }
}

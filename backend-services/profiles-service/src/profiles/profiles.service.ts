import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { ProfilesDao } from './dao/profiles.dao'
import { ProfileModel } from './domain-model/profile.model'
import { CreateProfileDto } from './dto/create-profile.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class ProfilesService {
  constructor(private readonly dao: ProfilesDao) {}

  findAll(): Promise<ProfileModel[]> {
    return this.dao.findAll()
  }

  async create(dto: CreateProfileDto): Promise<ProfileModel> {
    const existing = await this.dao.findById(dto.id)
    if (existing) {
      throw new ConflictException(`Profile with id "${dto.id}" already exists`)
    }
    return this.dao.create(new ProfileModel(dto))
  }

  async update(id: string, dto: UpdateProfileDto): Promise<ProfileModel> {
    const model = await this.dao.findById(id)
    if (!model) {
      throw new NotFoundException(`Profile with id "${id}" not found`)
    }
    if (dto.firstName !== undefined) model.firstName = dto.firstName
    if (dto.lastName !== undefined) model.lastName = dto.lastName
    return this.dao.save(model)
  }

  async remove(id: string): Promise<void> {
    const affected = await this.dao.delete(id)
    if (!affected) {
      throw new NotFoundException(`Profile with id "${id}" not found`)
    }
  }
}

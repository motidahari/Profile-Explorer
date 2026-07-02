import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseDao } from '@libs/shared'
import { Profile } from '../domain/profile.entity'
import { ProfileModel } from '../domain-model/profile.model'

@Injectable()
export class ProfilesDao extends BaseDao<Profile, ProfileModel> {
  constructor(
    @InjectRepository(Profile)
    repository: Repository<Profile>,
  ) {
    super(repository)
  }

  /** Creates and persists a new profile from the given domain model. */
  async create(model: ProfileModel): Promise<ProfileModel> {
    return this.createOne(model)
  }

  /** Persists changes to an existing profile (full save) and returns the refreshed model. */
  async save(model: ProfileModel): Promise<ProfileModel> {
    return this.saveOne(model)
  }

  /** Returns all profiles, most recently saved first. */
  async findAll(): Promise<ProfileModel[]> {
    return this.findManyBy({}, { createdAt: 'DESC' })
  }

  /** Finds a profile by its stable identifier (randomuser.me login.uuid). */
  async findById(id: string): Promise<ProfileModel | null> {
    return super.findById(id)
  }

  /** Deletes a profile by id. Returns the number of rows removed (0 when absent). */
  async delete(id: string): Promise<number> {
    return this.deleteBy(id)
  }

  protected toDomainModel(entity: Profile): ProfileModel {
    return new ProfileModel({
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      gender: entity.gender,
      age: entity.age,
      yearOfBirth: entity.yearOfBirth,
      email: entity.email,
      phone: entity.phone,
      pictureUrl: entity.pictureUrl,
      country: entity.country,
      city: entity.city,
      state: entity.state,
      street: entity.street,
    })
  }

  protected toEntity(model: ProfileModel): Partial<Profile> {
    return this.pruneUndefined({
      id: model.id,
      firstName: model.firstName,
      lastName: model.lastName,
      gender: model.gender,
      age: model.age,
      yearOfBirth: model.yearOfBirth,
      email: model.email,
      phone: model.phone,
      pictureUrl: model.pictureUrl,
      country: model.country,
      city: model.city,
      state: model.state,
      street: model.street,
    })
  }
}

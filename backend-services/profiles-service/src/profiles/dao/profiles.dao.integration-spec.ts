import { randomUUID } from 'node:crypto'
import { DataSource, Repository } from 'typeorm'
import { ProfilesDao } from './profiles.dao'
import { Profile } from '../domain/profile.entity'
import { ProfileModel } from '../domain-model/profile.model'
import { Gender } from '../enum/gender.enum'

/**
 * Exercises the DAO against a real Postgres instance (no mocks). It shares the dev
 * database but only ever removes the rows it created, tracked in `createdIds`, so
 * existing data is never touched. Requires `npm run db:up` to be running.
 */
const buildModel = (overrides: Partial<ProfileModel> = {}): ProfileModel =>
  new ProfileModel({
    id: randomUUID(),
    firstName: 'Jane',
    lastName: 'Doe',
    gender: Gender.FEMALE,
    age: 34,
    yearOfBirth: 1990,
    email: 'jane.doe@example.com',
    phone: '(555) 123-4567',
    pictureUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    country: 'United States',
    city: 'Denver',
    state: 'Colorado',
    street: '123 Main Street',
    ...overrides,
  })

describe('ProfilesDao (integration)', () => {
  let dataSource: DataSource
  let repository: Repository<Profile>
  let dao: ProfilesDao
  const createdIds: string[] = []

  const track = (model: ProfileModel): ProfileModel => {
    createdIds.push(model.id)
    return model
  }

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'profiles',
      password: process.env.DB_PASSWORD ?? 'profiles',
      database: process.env.DB_NAME ?? 'profiles',
      entities: [Profile],
      synchronize: true,
    })
    await dataSource.initialize()
    repository = dataSource.getRepository(Profile)
    dao = new ProfilesDao(repository)
  })

  afterEach(async () => {
    if (createdIds.length > 0) {
      await repository.delete(createdIds)
      createdIds.length = 0
    }
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  describe('create', () => {
    it('persists a profile and returns it as a domain model', async () => {
      const created = await dao.create(track(buildModel({ firstName: 'Ada' })))

      expect(created).toBeInstanceOf(ProfileModel)
      expect(created.firstName).toBe('Ada')

      const row = await repository.findOne({ where: { id: created.id } })
      expect(row?.firstName).toBe('Ada')
    })
  })

  describe('findById', () => {
    it('returns the matching profile as a domain model', async () => {
      const model = track(buildModel())
      await dao.create(model)

      const found = await dao.findById(model.id)
      expect(found).toBeInstanceOf(ProfileModel)
      expect(found?.id).toBe(model.id)
    })

    it('returns null when no profile matches', async () => {
      expect(await dao.findById(randomUUID())).toBeNull()
    })
  })

  describe('findAll', () => {
    it('returns previously created profiles as domain models', async () => {
      const a = track(buildModel({ firstName: 'First' }))
      const b = track(buildModel({ firstName: 'Second' }))
      await dao.create(a)
      await dao.create(b)

      const all = await dao.findAll()
      const ours = all.filter((p) => createdIds.includes(p.id))

      expect(ours).toHaveLength(2)
      expect(ours.every((p) => p instanceof ProfileModel)).toBe(true)
    })
  })

  describe('save', () => {
    it('updates an existing profile and returns the refreshed model', async () => {
      const model = track(buildModel({ lastName: 'Before' }))
      await dao.create(model)

      model.lastName = 'After'
      const saved = await dao.save(model)

      expect(saved.lastName).toBe('After')
      const row = await repository.findOne({ where: { id: model.id } })
      expect(row?.lastName).toBe('After')
    })
  })

  describe('delete', () => {
    it('removes an existing profile and reports one row affected', async () => {
      const model = buildModel()
      await dao.create(model)

      const affected = await dao.delete(model.id)
      expect(affected).toBe(1)
      expect(await repository.findOne({ where: { id: model.id } })).toBeNull()
    })

    it('reports zero rows affected when the profile is absent', async () => {
      expect(await dao.delete(randomUUID())).toBe(0)
    })
  })
})

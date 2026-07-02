import { ValidationException } from '@libs/shared'
import { ProfileModel } from './profile.model'
import { Gender } from '../enum/gender.enum'

const validAttrs = (): ConstructorParameters<typeof ProfileModel>[0] => ({
  id: '9b2f8c1a-4d3e-4f2a-8b1c-2e6f7a9d0c31',
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
})

describe('ProfileModel', () => {
  describe('construction with valid attributes', () => {
    it('exposes every field through getters', () => {
      const model = new ProfileModel(validAttrs())

      expect(model.id).toBe('9b2f8c1a-4d3e-4f2a-8b1c-2e6f7a9d0c31')
      expect(model.firstName).toBe('Jane')
      expect(model.gender).toBe(Gender.FEMALE)
      expect(model.age).toBe(34)
      expect(model.yearOfBirth).toBe(1990)
    })

    it('serialises to a plain object via toJSON', () => {
      const attrs = validAttrs()
      const model = new ProfileModel(attrs)

      expect(model.toJSON()).toEqual(attrs)
    })
  })

  describe('field validation', () => {
    it('rejects a non-UUID id', () => {
      expect(() => new ProfileModel({ ...validAttrs(), id: 'not-a-uuid' })).toThrow(
        ValidationException,
      )
    })

    it('rejects an empty first name', () => {
      expect(() => new ProfileModel({ ...validAttrs(), firstName: '   ' })).toThrow(
        ValidationException,
      )
    })

    it('rejects an unknown gender', () => {
      expect(
        () => new ProfileModel({ ...validAttrs(), gender: 'other' as unknown as Gender }),
      ).toThrow(ValidationException)
    })

    it('rejects a non-integer or negative age', () => {
      expect(() => new ProfileModel({ ...validAttrs(), age: 12.5 })).toThrow(ValidationException)
      expect(() => new ProfileModel({ ...validAttrs(), age: -1 })).toThrow(ValidationException)
    })

    it('rejects a year of birth outside the plausible range', () => {
      expect(() => new ProfileModel({ ...validAttrs(), yearOfBirth: 1800 })).toThrow(
        ValidationException,
      )
      expect(() => new ProfileModel({ ...validAttrs(), yearOfBirth: 3000 })).toThrow(
        ValidationException,
      )
    })

    it('rejects a malformed email', () => {
      expect(() => new ProfileModel({ ...validAttrs(), email: 'jane@' })).toThrow(
        ValidationException,
      )
    })
  })

  describe('mutation via setters (update flow)', () => {
    it('validates the new value when a name is reassigned', () => {
      const model = new ProfileModel(validAttrs())

      model.firstName = 'Janet'
      expect(model.firstName).toBe('Janet')

      expect(() => {
        model.lastName = ''
      }).toThrow(ValidationException)
    })
  })
})

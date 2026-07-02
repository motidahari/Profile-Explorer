import {
  ValidationException,
  isValidUuid,
  isValidString,
  isValidNumber,
  isValidEnum,
  EMAIL_PATTERN,
} from '@libs/shared'
import { Gender } from '../enum/gender.enum'

/** Upper bound for a plausible year of birth; keeps obviously bad data out. */
const MIN_YEAR_OF_BIRTH = 1900
const MAX_AGE = 150

/**
 * Profile domain model. Every field is validated at assignment time via its setter,
 * so an instance can never hold invalid state. Construct from a plain attributes
 * object; serialise back to a plain object with {@link toJSON} (used by the HTTP layer).
 */
export class ProfileModel {
  private _id!: string
  private _firstName!: string
  private _lastName!: string
  private _gender!: Gender
  private _age!: number
  private _yearOfBirth!: number
  private _email!: string
  private _phone!: string
  private _pictureUrl!: string
  private _country!: string
  private _city!: string
  private _state!: string
  private _street!: string

  constructor(attrs: Partial<ProfileModel>) {
    if (attrs.id !== undefined) this.id = attrs.id
    if (attrs.firstName !== undefined) this.firstName = attrs.firstName
    if (attrs.lastName !== undefined) this.lastName = attrs.lastName
    if (attrs.gender !== undefined) this.gender = attrs.gender
    if (attrs.age !== undefined) this.age = attrs.age
    if (attrs.yearOfBirth !== undefined) this.yearOfBirth = attrs.yearOfBirth
    if (attrs.email !== undefined) this.email = attrs.email
    if (attrs.phone !== undefined) this.phone = attrs.phone
    if (attrs.pictureUrl !== undefined) this.pictureUrl = attrs.pictureUrl
    if (attrs.country !== undefined) this.country = attrs.country
    if (attrs.city !== undefined) this.city = attrs.city
    if (attrs.state !== undefined) this.state = attrs.state
    if (attrs.street !== undefined) this.street = attrs.street
  }

  get id(): string {
    return this._id
  }
  set id(value: string) {
    if (!isValidUuid(value)) {
      throw new ValidationException(`Invalid id: must be a valid UUID (received: ${value})`)
    }
    this._id = value
  }

  get firstName(): string {
    return this._firstName
  }
  set firstName(value: string) {
    if (!isValidString(value)) {
      throw new ValidationException(
        `Invalid firstName: must be a non-empty string (received: ${value})`,
      )
    }
    this._firstName = value
  }

  get lastName(): string {
    return this._lastName
  }
  set lastName(value: string) {
    if (!isValidString(value)) {
      throw new ValidationException(
        `Invalid lastName: must be a non-empty string (received: ${value})`,
      )
    }
    this._lastName = value
  }

  get gender(): Gender {
    return this._gender
  }
  set gender(value: Gender) {
    if (!isValidEnum(value, Gender)) {
      throw new ValidationException(
        `Invalid gender: must be one of male|female (received: ${value})`,
      )
    }
    this._gender = value
  }

  get age(): number {
    return this._age
  }
  set age(value: number) {
    if (!isValidNumber(value, { integer: true, min: 0, max: MAX_AGE })) {
      throw new ValidationException(
        `Invalid age: must be an integer between 0 and ${MAX_AGE} (received: ${value})`,
      )
    }
    this._age = value
  }

  get yearOfBirth(): number {
    return this._yearOfBirth
  }
  set yearOfBirth(value: number) {
    const currentYear = new Date().getFullYear()
    if (!isValidNumber(value, { integer: true, min: MIN_YEAR_OF_BIRTH, max: currentYear })) {
      throw new ValidationException(
        `Invalid yearOfBirth: must be an integer between ${MIN_YEAR_OF_BIRTH} and ${currentYear} (received: ${value})`,
      )
    }
    this._yearOfBirth = value
  }

  get email(): string {
    return this._email
  }
  set email(value: string) {
    if (!isValidString(value, { pattern: EMAIL_PATTERN })) {
      throw new ValidationException(`Invalid email: "${value}"`)
    }
    this._email = value
  }

  get phone(): string {
    return this._phone
  }
  set phone(value: string) {
    if (!isValidString(value)) {
      throw new ValidationException(
        `Invalid phone: must be a non-empty string (received: ${value})`,
      )
    }
    this._phone = value
  }

  get pictureUrl(): string {
    return this._pictureUrl
  }
  set pictureUrl(value: string) {
    if (!isValidString(value)) {
      throw new ValidationException(
        `Invalid pictureUrl: must be a non-empty string (received: ${value})`,
      )
    }
    this._pictureUrl = value
  }

  get country(): string {
    return this._country
  }
  set country(value: string) {
    if (!isValidString(value)) {
      throw new ValidationException(
        `Invalid country: must be a non-empty string (received: ${value})`,
      )
    }
    this._country = value
  }

  get city(): string {
    return this._city
  }
  set city(value: string) {
    if (!isValidString(value)) {
      throw new ValidationException(`Invalid city: must be a non-empty string (received: ${value})`)
    }
    this._city = value
  }

  get state(): string {
    return this._state
  }
  set state(value: string) {
    if (!isValidString(value)) {
      throw new ValidationException(
        `Invalid state: must be a non-empty string (received: ${value})`,
      )
    }
    this._state = value
  }

  get street(): string {
    return this._street
  }
  set street(value: string) {
    if (!isValidString(value)) {
      throw new ValidationException(
        `Invalid street: must be a non-empty string (received: ${value})`,
      )
    }
    this._street = value
  }

  toJSON() {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      gender: this._gender,
      age: this._age,
      yearOfBirth: this._yearOfBirth,
      email: this._email,
      phone: this._phone,
      pictureUrl: this._pictureUrl,
      country: this._country,
      city: this._city,
      state: this._state,
      street: this._street,
    }
  }
}

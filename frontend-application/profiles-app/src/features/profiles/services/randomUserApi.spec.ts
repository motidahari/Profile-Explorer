import { describe, it, expect } from 'vitest'
import { mapRandomUserToProfile } from './randomUserApi'
import type { RandomUserResult } from '../types/random-user'

function makeResult(overrides: Partial<RandomUserResult> = {}): RandomUserResult {
  return {
    gender: 'female',
    name: { first: 'Ada', last: 'Lovelace' },
    location: {
      street: { number: 10, name: 'Downing St' },
      city: 'London',
      state: 'England',
      country: 'United Kingdom',
    },
    email: 'ada@example.com',
    login: { uuid: 'uuid-1' },
    dob: { date: '1815-12-10T00:00:00.000Z', age: 36 },
    phone: '555-0100',
    picture: {
      large: 'https://example.com/large.jpg',
      medium: 'https://example.com/medium.jpg',
      thumbnail: 'https://example.com/thumb.jpg',
    },
    ...overrides,
  }
}

describe('mapRandomUserToProfile', () => {
  it('uses login.uuid as the stable id', () => {
    expect(mapRandomUserToProfile(makeResult()).id).toBe('uuid-1')
  })

  it('derives yearOfBirth from the dob date', () => {
    expect(mapRandomUserToProfile(makeResult()).yearOfBirth).toBe(1815)
  })

  it('joins street number and name', () => {
    expect(mapRandomUserToProfile(makeResult()).street).toBe('10 Downing St')
  })

  it('maps the large picture to pictureUrl', () => {
    expect(mapRandomUserToProfile(makeResult()).pictureUrl).toBe('https://example.com/large.jpg')
  })

  it('maps the remaining fields onto the Profile shape', () => {
    expect(mapRandomUserToProfile(makeResult())).toEqual({
      id: 'uuid-1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      gender: 'female',
      age: 36,
      yearOfBirth: 1815,
      email: 'ada@example.com',
      phone: '555-0100',
      pictureUrl: 'https://example.com/large.jpg',
      country: 'United Kingdom',
      city: 'London',
      state: 'England',
      street: '10 Downing St',
    })
  })
})

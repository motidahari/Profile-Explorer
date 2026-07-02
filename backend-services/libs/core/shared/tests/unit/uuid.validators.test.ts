import { isValidUuid, UUID_PATTERN } from '../../src/validation/uuid.validators'

const VALID_UUID = '9b2f8c1a-4d3e-4f2a-8b1c-2e6f7a9d0c31'

describe('isValidUuid', () => {
  it('accepts a well-formed UUID', () => {
    expect(isValidUuid(VALID_UUID)).toBe(true)
  })

  it('rejects malformed or non-string values', () => {
    expect(isValidUuid('not-a-uuid')).toBe(false)
    expect(isValidUuid('9b2f8c1a-4d3e-4f2a-8b1c')).toBe(false)
    expect(isValidUuid(123)).toBe(false)
    expect(isValidUuid('')).toBe(false)
  })

  describe('absence handling', () => {
    it('rejects undefined and null by default', () => {
      expect(isValidUuid(undefined)).toBe(false)
      expect(isValidUuid(null)).toBe(false)
    })

    it('honours optional and nullable', () => {
      expect(isValidUuid(undefined, { optional: true })).toBe(true)
      expect(isValidUuid(null, { nullable: true })).toBe(true)
    })
  })
})

describe('UUID_PATTERN', () => {
  it('matches the 8-4-4-4-12 hex shape', () => {
    expect(UUID_PATTERN.test(VALID_UUID)).toBe(true)
    expect(UUID_PATTERN.test(VALID_UUID.toUpperCase())).toBe(true)
  })
})

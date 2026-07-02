import { isValidString, EMAIL_PATTERN } from '../../src/validation/string.validators'

describe('isValidString', () => {
  it('accepts a non-empty string by default', () => {
    expect(isValidString('hello')).toBe(true)
  })

  it('rejects non-string values', () => {
    expect(isValidString(42)).toBe(false)
    expect(isValidString({})).toBe(false)
    expect(isValidString([])).toBe(false)
  })

  it('rejects empty or whitespace-only strings when required (default)', () => {
    expect(isValidString('')).toBe(false)
    expect(isValidString('   ')).toBe(false)
  })

  it('allows empty strings when required is false', () => {
    expect(isValidString('', { required: false })).toBe(true)
  })

  describe('absence handling', () => {
    it('rejects undefined and null by default', () => {
      expect(isValidString(undefined)).toBe(false)
      expect(isValidString(null)).toBe(false)
    })

    it('honours optional and nullable', () => {
      expect(isValidString(undefined, { optional: true })).toBe(true)
      expect(isValidString(null, { nullable: true })).toBe(true)
    })
  })

  describe('length bounds', () => {
    it('enforces min length', () => {
      expect(isValidString('ab', { min: 3 })).toBe(false)
      expect(isValidString('abc', { min: 3 })).toBe(true)
    })

    it('enforces max length', () => {
      expect(isValidString('abcd', { max: 3 })).toBe(false)
      expect(isValidString('abc', { max: 3 })).toBe(true)
    })
  })

  describe('pattern', () => {
    it('enforces a regex pattern', () => {
      expect(isValidString('nope', { pattern: EMAIL_PATTERN })).toBe(false)
      expect(isValidString('jane@example.com', { pattern: EMAIL_PATTERN })).toBe(true)
    })
  })
})

describe('EMAIL_PATTERN', () => {
  it('matches well-formed addresses', () => {
    expect(EMAIL_PATTERN.test('jane.doe@example.co.uk')).toBe(true)
  })

  it('rejects malformed addresses', () => {
    expect(EMAIL_PATTERN.test('jane@')).toBe(false)
    expect(EMAIL_PATTERN.test('jane example.com')).toBe(false)
    expect(EMAIL_PATTERN.test('jane@example')).toBe(false)
  })
})

import { isValidNumber } from '../../src/validation/number.validators'

describe('isValidNumber', () => {
  it('accepts a finite number by default', () => {
    expect(isValidNumber(0)).toBe(true)
    expect(isValidNumber(3.14)).toBe(true)
    expect(isValidNumber(-5)).toBe(true)
  })

  it('rejects non-number and non-finite values', () => {
    expect(isValidNumber('5')).toBe(false)
    expect(isValidNumber(NaN)).toBe(false)
    expect(isValidNumber(Infinity)).toBe(false)
  })

  describe('absence handling', () => {
    it('rejects undefined and null by default', () => {
      expect(isValidNumber(undefined)).toBe(false)
      expect(isValidNumber(null)).toBe(false)
    })

    it('honours optional and nullable', () => {
      expect(isValidNumber(undefined, { optional: true })).toBe(true)
      expect(isValidNumber(null, { nullable: true })).toBe(true)
    })
  })

  describe('constraints', () => {
    it('enforces positive', () => {
      expect(isValidNumber(0, { positive: true })).toBe(false)
      expect(isValidNumber(1, { positive: true })).toBe(true)
    })

    it('enforces integer', () => {
      expect(isValidNumber(1.5, { integer: true })).toBe(false)
      expect(isValidNumber(2, { integer: true })).toBe(true)
    })

    it('enforces min and max (inclusive)', () => {
      expect(isValidNumber(1900, { min: 1900, max: 2100 })).toBe(true)
      expect(isValidNumber(1899, { min: 1900 })).toBe(false)
      expect(isValidNumber(2101, { max: 2100 })).toBe(false)
    })
  })
})

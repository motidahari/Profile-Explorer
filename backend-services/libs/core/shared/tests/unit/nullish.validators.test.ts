import { isNullish } from '../../src/validation/nullish.validators'

describe('isNullish', () => {
  it('returns true for null and undefined', () => {
    expect(isNullish(null)).toBe(true)
    expect(isNullish(undefined)).toBe(true)
  })

  it('returns false for defined values, including falsy ones', () => {
    expect(isNullish(0)).toBe(false)
    expect(isNullish('')).toBe(false)
    expect(isNullish(false)).toBe(false)
    expect(isNullish({})).toBe(false)
  })
})

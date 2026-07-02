import { isValidEnum } from '../../src/validation/enum.validators'

enum Color {
  RED = 'red',
  GREEN = 'green',
}

describe('isValidEnum', () => {
  it('accepts values that belong to the enum', () => {
    expect(isValidEnum('red', Color)).toBe(true)
    expect(isValidEnum('green', Color)).toBe(true)
  })

  it('rejects values outside the enum', () => {
    expect(isValidEnum('blue', Color)).toBe(false)
    expect(isValidEnum('RED', Color)).toBe(false)
    expect(isValidEnum(1, Color)).toBe(false)
  })

  describe('absence handling', () => {
    it('rejects undefined and null by default', () => {
      expect(isValidEnum(undefined, Color)).toBe(false)
      expect(isValidEnum(null, Color)).toBe(false)
    })

    it('honours optional and nullable', () => {
      expect(isValidEnum(undefined, Color, { optional: true })).toBe(true)
      expect(isValidEnum(null, Color, { nullable: true })).toBe(true)
    })
  })
})

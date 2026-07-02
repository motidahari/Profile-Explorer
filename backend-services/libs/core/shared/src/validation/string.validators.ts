import { BaseValidationOptions } from './base.validators'

/** Pragmatic email shape: non-space local + domain with a dot. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface StringValidationOptions extends BaseValidationOptions {
  /** Reject empty or whitespace-only strings. Default: true */
  required?: boolean
  /** Minimum string length (inclusive) */
  min?: number
  /** Maximum string length (inclusive) */
  max?: number
  /** Regex pattern the string must match */
  pattern?: RegExp
}

export function isValidString(value: unknown, options: StringValidationOptions = {}): boolean {
  const { optional = false, nullable = false, required = true, min, max, pattern } = options

  if (value === undefined) return optional
  if (value === null) return nullable
  if (typeof value !== 'string') return false
  if (required && value.trim().length === 0) return false
  if (min !== undefined && value.length < min) return false
  if (max !== undefined && value.length > max) return false
  if (pattern !== undefined && !pattern.test(value)) return false

  return true
}

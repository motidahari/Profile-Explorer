/**
 * Raised by domain models when a field fails validation. Framework-agnostic on
 * purpose: the HTTP layer decides how to translate it (e.g. to a 400 response).
 */
export class ValidationException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationException'
    Error.captureStackTrace(this, this.constructor)
  }
}

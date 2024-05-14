/**
 * Custom error class to represent HTTP errors.
 *
 * @extends {Error}
 */
export class HttpError extends Error {
  private _status: number;
  /**
   * Creates an instance of HttpError.
   *
   * @param {number} status - The HTTP status code associated with the error.
   * @param {string | Error} error - The error message or Error object.
   * @param {Error} [cause] - Optional. The underlying cause of the error.
   */
  constructor(
    status: number,
    public readonly error: string | Error,
    public readonly cause?: Error
  ) {
    super(`[${status || 500}] ${typeof error === 'string' ? error : error.message}`);
    this._status = status || 500;
  }

  /**
   * Gets the HTTP status code.
   *
   * @returns {number} The HTTP status code.
   */
  get status() {
    return this._status;
  }
}

export class HttpError extends Error {
  private _status: number;
  constructor(
    status: number,
    public readonly error: string | Error,
    public readonly cause?: Error
  ) {
    super(`[${status | 500}] ${typeof error === 'string' ? error : error.message}`);
    this._status = status | 500;
  }

  get status() {
    return this._status;
  }
}

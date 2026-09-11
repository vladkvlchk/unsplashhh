export class UnsplashApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "UnsplashApiError";
  }
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof UnsplashApiError && error.status === 404;
}

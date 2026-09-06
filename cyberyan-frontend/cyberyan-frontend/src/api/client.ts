const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Thin fetch wrapper: builds the URL, parses JSON, and turns both network
 * failures and non-2xx responses into a single `ApiError` type that
 * components/hooks can branch on without knowing about `fetch` internals.
 */
export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new ApiError(`Couldn't reach the API at ${BASE_URL}. Is the backend running?`);
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (typeof body?.message === "string") message = body.message;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

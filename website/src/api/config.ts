/* ─────────────────────────────────────────────────────────────────────────────
   API Config — base URL and shared fetch helper.
   ───────────────────────────────────────────────────────────────────────────── */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3001/api";

/**
 * Typed fetch helper for future API calls.
 * Wraps native fetch, sets JSON content-type, and throws on non-2xx responses.
 *
 * @param path   - URL path appended to API_BASE_URL (e.g. '/projects')
 * @param init   - Standard RequestInit options (method, body, headers, …)
 * @returns      Parsed JSON response typed as T
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`API error ${response.status}: ${message}`);
  }

  return response.json() as Promise<T>;
}

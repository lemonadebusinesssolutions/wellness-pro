//start of code
import { QueryClient } from '@tanstack/react-query'

/**
 * A shared QueryClient instance configured with sensible defaults for the WellnessPro app.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      queryFn: async ({ queryKey }) => {
        if (
          !Array.isArray(queryKey) ||
          queryKey.length === 0 ||
          typeof queryKey[0] !== 'string'
        ) {
          throw new Error('Invalid query key')
        }

        const endpoint = queryKey[0]
        const response = await fetch(`/api/${endpoint}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Fetch error: ${response.status} ${response.statusText} - ${errorText}`)
        }

        return response.json()
      },
    },
  },
})

export default queryClient

/**
 * Perform an API request with credentials and JSON handling.
 * @param input Request URL
 * @param init Optional request init with object body support
 * @returns Parsed JSON response
 */
export async function apiRequest<T>(
  input: RequestInfo,
  init?: Omit<RequestInit, 'body'> & { body?: Record<string, any> }
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'API request failed')
  }

  return response.json()
}

/**
 * Generate a query function for React Query using a static API endpoint.
 * @param endpoint The API route to query, e.g., 'auth/me'
 * @returns Query function compatible with useQuery
 */
export function getQueryFn<T>(endpoint: string) {
  return async () => await apiRequest<T>(`/api/${endpoint}`)
}
//end of code

import { QueryClient } from '@tanstack/react-query'

/**
 * Main Query Client for React Query with default options.
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
        const response = await fetch(`/api${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, {
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

/**
 * Helper function to make API requests with credentials.
 */
export async function apiRequest<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  body?: any
): Promise<T> {
  const response = await fetch(url, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'API request failed')
  }

  return response.json()
}

export default queryClient

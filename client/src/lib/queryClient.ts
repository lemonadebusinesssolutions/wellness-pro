// client/src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      queryFn: async ({ queryKey }) => {
        if (!Array.isArray(queryKey) || typeof queryKey[0] !== "string") {
          throw new Error("Invalid query key")
        }

        const endpoint = queryKey[0]
        return await apiRequest(endpoint)
      },
    },
  },
})

export default queryClient

/**
 * Safe API request that prevents duplicate /api/api issues
 */
export async function apiRequest<T>(
  input: string,
  init?: Omit<RequestInit, "body"> & { body?: Record<string, any> }
): Promise<T> {
  const base = import.meta.env.VITE_API_BASE_URL || ""
  const cleanBase = base.replace(/\/+$/, "")
  const cleanInput = input.replace(/^\/?api\/?/, "") // ✅ remove leading "api/"
  const fullUrl = `${cleanBase}/api/${cleanInput}`

  const response = await fetch(fullUrl, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}

/**
 * Static API endpoint query for React Query
 */
export function getQueryFn<T>(endpoint: string) {
  return async () => await apiRequest<T>(endpoint)
}

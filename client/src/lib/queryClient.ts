//start of code
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      queryFn: async ({ queryKey }) => {
        if (!Array.isArray(queryKey) || queryKey.length === 0 || typeof queryKey[0] !== 'string') {
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
//end of code

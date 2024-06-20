'use client'

import { QueryKey, useQueryClient } from '@tanstack/react-query'

export function useRefetchQueries() {
   const queryClient = useQueryClient()

   const refetchQueries = (queries: string | string[]) => {
      const isQueryInKeys = (queryKey: QueryKey) => {
         return Array.isArray(queries)
            ? queries.some((query) => queryKey.includes(query))
            : queryKey.includes(queries)
      }

      queryClient.refetchQueries({
         type: 'all',
         exact: false,
         predicate: ({ queryKey }) => isQueryInKeys(queryKey),
      })
   }

   return { refetchQueries }
}

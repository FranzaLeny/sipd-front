'use client'

import axios from '@custom-axios/index'
import { useQuery } from '@tanstack/react-query'

export function useSipdPetaFetcher<T = any>({
   token,
   url,
   enabled = true,
   params,
}: {
   url?: string | null
   token?: string | null
   enabled?: boolean
   params?: Record<string, string | number | undefined | null>
}) {
   const query = useQuery({
      queryKey: [url, token, params] as [string, string, Record<string, string | number>],
      queryFn: async ({ queryKey: [url, token, params] }) => {
         if (!token || !url) throw new Error('Token or URL is undefined')
         return await axios.get<T>(url, {
            params: params,
            headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'application/json',
               Accept: 'application/json',
            },
         })
      },
      enabled: enabled,
      placeholderData: (previousData) => previousData,
   })
   return query
}

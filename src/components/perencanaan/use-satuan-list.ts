import { getListSatuan, GetSatuanListParams } from '@actions/perencanaan/data/satuan'
import { useQuery } from '@tanstack/react-query'

export type UseSatuanListProps = {
   params?: GetSatuanListParams
}

export function useSatuanList({ params = {} }: UseSatuanListProps = {}) {
   const satuan = useQuery({
      queryKey: ['data_satuan', { search: '', limit: 1000, ...params }] as [
         string,
         GetSatuanListParams,
      ],
      queryFn: async ({ queryKey: [key, params] }) => {
         return await getListSatuan(params)
      },
      placeholderData: (previousData) => previousData,
   })

   return satuan
}

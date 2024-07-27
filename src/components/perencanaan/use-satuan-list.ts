import { getListSatuan, GetSatuanListParams } from '@actions/perencanaan/data/satuan'
import { useQuery } from '@tanstack/react-query'

export type UseSatuanListProps = {
   params?: GetSatuanListParams
}

export function useSatuanList({ params = {} }: UseSatuanListProps = {}) {
   const satuan = useQuery({
      queryKey: [{ search: '', limit: 1000, ...params }, 'data_satuan'] as [
         GetSatuanListParams,
         ...string[],
      ],
      queryFn: async ({ queryKey: [params] }) => {
         return await getListSatuan(params)
      },
      placeholderData: (previousData) => previousData,
   })

   return satuan
}

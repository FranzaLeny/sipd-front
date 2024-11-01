import { getListSatuan } from '@actions/perencanaan/data/satuan'
import { useQuery } from '@tanstack/react-query'

type GetListSatuanParams = Parameters<typeof getListSatuan>[0]

export type UseSatuanListProps = {
   params?: GetListSatuanParams
}

export function useSatuanList({ params = {} }: UseSatuanListProps = {}) {
   const satuan = useQuery({
      queryKey: [{ limit: 1000, ...params }, 'data_satuan'] as [GetListSatuanParams, ...string[]],
      queryFn: async ({ queryKey: [params] }) => {
         return await getListSatuan(params)
      },
      placeholderData: (previousData) => previousData,
   })

   return satuan
}

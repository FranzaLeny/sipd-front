import axios from '@custom-axios/api-fetcher'
import { postToSipd } from '@custom-axios/sipd-fetcher'

export const getListPendapatanByUnitSipd = async (payload: ListPendapatanByUnitSipdPayload) => {
   return await postToSipd('listPendapatanByUnit', {
      keys: ['id_daerah', 'tahun', 'id_unit'],
      params: payload,
   }).then((res) => res.data)
}

export const getListPendapatanSkpdSipd = async (payload: ListPendapatanSkpdSipdPayload) => {
   return await postToSipd('listPendapatan', {
      keys: [
         'id_daerah',
         'tahun',
         'id_unit',
         'length',
         'model',
         'start',
         'order[0][column]',
         'order[0][dir]',
      ],
      params: payload,
   }).then((res) => res.data)
}

export const getListPendapatan = async (params: GetListPendapatanParams) =>
   await axios
      .get<ResponseApi<CursorPaginate<unknown>>>(`/api/perencanaan/rka/pendapatan`, {
         params,
      })
      .then((res) => res.data)

export const syncPendapatan = async (data: PendapatanUncheckedCreateInput[]) =>
   await axios.put<ResponseApi>(`/api/perencanaan/rka/pendapatan`, data)

export async function getTotalPendapatan<T extends Partial<GetPendapatanParams>>(params?: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/rka/pendapatan/total`, { params })
      .then((res) => res?.data)
}

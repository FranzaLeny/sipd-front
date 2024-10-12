import axios from '@shared/custom-axios/api-fetcher'
import { postToSipd } from '@shared/custom-axios/sipd-fetcher'

export const getListSumberDanaSipd = async (params: ListSumberDanaSipdPayload) => {
   return await postToSipd('listSumberDana', {
      keys: ['length'],
      params,
   }).then((res) => res.data)
}
export const getAllSumberDanaSipd = async (params: ListSumberDanaSipdPayload) => {
   return await getListSumberDanaSipd({ ...params, length: 1 }).then(async (d) => {
      return await getListSumberDanaSipd({ ...params, length: d.recordsTotal })
   })
}

export async function getListSumberDana(
   params: GetListSumberDanaParams & { limit?: number; search?: string; after?: string }
) {
   return await axios
      .get<ResponseApi<CursorPaginate<SumberDana>>>(`/api/perencanaan/data/sumber-dana`, { params })
      .then((res) => res?.data)
}

export async function getTotalSumberDana<T extends GetListSumberDanaParams>(params?: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/data/sumber-dana/total`, { params })
      .then((res) => res?.data)
}

export async function syncSumberDana(data: SumberDanaUncheckedCreateInput[]) {
   return await axios.put('/api/perencanaan/data/sumber-dana', data)
}

export async function deleteOldSumberDana(data: SumberDanaDeleteOldParams) {
   return await axios.delete('/api/perencanaan/data/sumber-dana/old', { data })
}

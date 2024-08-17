import axios from '@shared/custom-axios/api-fetcher'
import { postToSipd } from '@shared/custom-axios/sipd-fetcher'

export const getListSatuanSipd = async (params: ListSatuanSipdPayload) => {
   return await postToSipd('listSatuan', {
      keys: ['length'],
      params,
   }).then((res) => res.data)
}

export async function getListSatuan(params: GetListSatuanParams) {
   return await axios
      .get<ResponseApi<CursorPaginate<Satuan>>>(`/api/perencanaan/data/satuan`, { params })
      .then((res) => res?.data)
}

export async function getTolalSatuan<T extends Partial<{}>>(params?: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/data/satuan/total`, { params })
      .then((res) => res?.data)
}

// APi
export async function syncSatuan(data: SatuanUncheckedCreateInput[]) {
   return await axios.put('/api/perencanaan/data/satuan', data)
}

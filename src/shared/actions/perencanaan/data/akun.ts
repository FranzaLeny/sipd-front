import axios from '@custom-axios/api-fetcher'
import { postToSipd } from '@shared/custom-axios/sipd-fetcher'

export const getListAkunSipd = async (payload: ListAkunSipdPayload) => {
   return await postToSipd('akun', {
      keys: ['id_daerah', 'tahun', 'length', 'start'],
      params: payload,
   }).then((res) => res.data)
}

export const geAllAkunSipd = async (params: ListAkunSipdPayload) => {
   return await getListAkunSipd({ ...params, length: 1 }).then(async (res) => {
      const length = res.recordsTotal
      const { data } = await getListAkunSipd({ ...params, length })
      return data
   })
}

// API

export async function syncAkun(data: AkunUncheckedCreateInput[]) {
   return await axios.put('/api/perencanaan/data/akun', data)
}

export async function deleteOldAkun(data: AkunDeleteOldParams) {
   return await axios.delete('/api/perencanaan/data/akun/old', { data })
}

export async function getListAkun(params: GetListAkunParams) {
   return axios
      .get<ResponseApi<CursorPaginate<Akun>>>(`/api/perencanaan/data/akun`, { params })
      .then((res) => res?.data)
}
export async function getTolalAkun<T extends Partial<GetAkunParams>>(params: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/data/akun/total`, { params })
      .then((res) => res?.data)
}

export async function getAkun(id: string) {
   return await axios
      .get<ResponseApi<Akun>>(`/api/perencanaan/data/akun/${id}`)
      ?.then((res) => res.data)
}
export async function updateAkun(id: string, data: Partial<Akun>) {
   return await axios.patch<ResponseApi<Akun>>(`/api/perencanaan/data/akun/${id}`, data)
}

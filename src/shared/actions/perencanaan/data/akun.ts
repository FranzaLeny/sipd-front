import axios from '@custom-axios/api-fetcher'
import { Akun, AkunUncheckedCreateInputSchema } from '@zod'
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

export async function syncAkun(data: Zod.infer<typeof AkunUncheckedCreateInputSchema>[]) {
   return await axios.put('api/perencanaan/master/akun', data)
}
export type GetAkunListParams = {
   tahun: number
   limit?: number
   search?: string
   after?: string
} & Partial<Akun>

export async function getListAkun(params: GetAkunListParams) {
   return axios
      .get<ResponseApi<CursorPaginate<Akun>>>(`api/perencanaan/master/akun`, { params })
      .then((res) => res?.data)
}
export async function getTolalAkun<T extends Partial<Akun>>(params: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`api/perencanaan/master/akun/total`, { params })
      .then((res) => res?.data)
}

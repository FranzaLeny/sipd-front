import axios from '@custom-axios/api-fetcher'
import { AnggotaTapd, Skpd, SkpdUncheckedCreateInputSchema } from '@zod'
import { omit } from 'lodash-es'
import { getFromSipd, postToSipd } from '@shared/custom-axios/sipd-fetcher'

export const getListAllSkpdSipd = async (payload: SkpdListAllSipdPayload) => {
   return await postToSipd('listAllSkpd', {
      keys: ['id_daerah', 'tahun'],
      params: payload,
   }).then((res) => res.data)
}

export const getListSkpdSipd = async (payload: SkpdListSipdPayload) => {
   return await postToSipd('listSkpd', {
      keys: ['id_daerah', 'tahun'],
      params: payload,
   }).then((res) => res)
}

export const getListNewSkpdSipd = async (payload: SkpdListSipdPayload) => {
   return await postToSipd('listNewSkpd', {
      keys: ['id_daerah', 'tahun', 'length'],
      params: payload,
   }).then((res) => res.data)
}

export const viewSkdSipd = async (params: SkpdViewSipdPayload) => {
   return await getFromSipd('viewSkpd', {
      params: params,
   })
}
export const getSkpd = async (id: string) => {
   return await axios
      .get<ResponseApi<Skpd>>(`/api/perencanaan/data/skpd/${id}`)
      .then((res) => res.data)
}

export type SkpdParams = {
   tahun?: number
   id_daerah?: number
   id_skpd?: number
   id_unit?: number
}

export type GetSkpdListParams = {
   limit?: number
   search?: string
   after?: string
} & SkpdParams

export const getSkpdList = async (params: GetSkpdListParams) => {
   return await axios
      .get<ResponseApi<CursorPaginate<Skpd>>>('/api/perencanaan/data/skpd', { params })
      .then((res) => res.data)
}
export const getAllSkpd = async (params: SkpdParams) => {
   return await axios
      .get<ResponseApi<Skpd[]>>('/api/perencanaan/data/skpd/all', { params })
      .then((res) => res.data)
}

export async function getTolalSkpd<T extends Partial<SkpdParams>>(params: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/data/skpd/total`, { params })
      .then((res) => res?.data)
}

export const updateSkpd = async (id: string, skpd: Partial<Omit<Skpd, 'id'>>) => {
   const data = SkpdUncheckedCreateInputSchema.partial().parse({ id, ...skpd })
   return await axios.patch(
      `/api/perencanaan/data/skpd/${id}`,
      omit(data, ['id', 'nama_bendahara', 'nip_bendahara'])
   )
}

export const syncSkpdSipd = async (data: Zod.infer<typeof SkpdUncheckedCreateInputSchema>[]) => {
   return await axios.put('/api/perencanaan/data/skpd', data)
}

export type ResponseSkpdTapdAnggaranBySkpd = {
   skpd: Skpd & { tahun: number }
   sub_skpd: Skpd & { tahun: number }
   tapd: AnggotaTapd[] | null
}

export const getSkpdTapdAnggaranBySkpd = async (params: {
   id_unit: number | string
   id_daerah: number | string
   tahun: number | string
   id_skpd: number | string
}) => {
   return await axios
      .get<
         ResponseApi<ResponseSkpdTapdAnggaranBySkpd>
      >(`/api/perencanaan/data/skpd/tapd`, { params })
      .then((res) => res.data)
}

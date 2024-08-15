import axios from '@custom-axios/api-fetcher'
import { postToSipd } from '@custom-axios/sipd-fetcher'
import { decryptBase64String } from '@utils/index'
import { BlSkpd, BlSkpdUncheckedCreateInputSchema } from '@zod'

export const getListBlSetupUnitSipd = async (payload: ListSetupUnitSipdPayload) => {
   return await postToSipd('listSetupUnit', {
      keys: ['id_daerah', 'tahun'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja skpd dari sipd')
      })
}

export const getListBlSkpdSipd = async (payload: ListBelanjaSkpdSipdPayload) => {
   return await postToSipd('listBelanjaSkpd', {
      keys: [
         'id_daerah',
         'id_unit',
         'tahun',
         'id_level',
         'id_user',
         'is_anggaran',
         'limit',
         'offset',
         'search',
      ],
      params: payload,
   })
      .then((res) => {
         const data = decryptBase64String(res.data) as BelanjaSkpdSipd[]
         return { ...res, data }
      })
      .catch(() => {
         throw new Error('Gagal mengambil data belanja skpd dari sipd')
      })
}

export const syncBlListSkpd = async (
   data: Zod.infer<typeof BlSkpdUncheckedCreateInputSchema>[]
) => {
   const valid = BlSkpdUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put('/api/perencanaan/rka/skpd', valid)
}

export type ListBlSkpdParams = {
   id_daerah?: number
   tahun?: number
   id_skpd?: number
   id_unit?: number
   jadwal_anggaran_id?: string
}

export type GetBlSkpdListParams = {
   limit?: number
   search?: string
   after?: string
} & ListBlSkpdParams

export const getBlSkpdList = async (params: GetBlSkpdListParams) => {
   return await axios
      .get<ResponseApi<CursorPaginate<BlSkpd>>>('/api/perencanaan/rka/skpd', { params })
      .then((res) => res.data)
}
export const getBlSkpd = async (id: string) => {
   return await axios
      .get<ResponseApi<BlSkpd>>(`/api/perencanaan/rka/skpd/${id}`)
      .then((res) => res.data)
}
export const getBlSkpdByIdSkpd = async (params: {
   id_skpd: number
   jadwal_anggaran_id: string
}) => {
   return await axios
      .get<ResponseApi<BlSkpd>>(`/api/perencanaan/rka/skpd/by-id-skpd`, { params })
      .then((res) => res.data)
}

export async function getTotalBlSkpd<T extends ListBlSkpdParams>(params?: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/rka/skpd/total`, { params })
      .then((res) => res?.data)
}

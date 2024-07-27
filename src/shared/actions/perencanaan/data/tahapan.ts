import axios from '@custom-axios/api-fetcher'
import { TahapanSchema, TahapanUncheckedCreateInputSchema } from '@zod'
import { postToSipd } from '@shared/custom-axios/sipd-fetcher'

export type Tahapan = Zod.infer<typeof TahapanSchema>

export const getListTahapanSipd = async (payload: ListTahapanSipdPayload) => {
   return await postToSipd('listTahapan', {
      keys: ['id_daerah', 'tahun', 'length', 'start'],
      params: payload,
   }).then((res) => res?.data)
}

export const syncTahapanSipd = async (
   data: Zod.infer<typeof TahapanUncheckedCreateInputSchema>[]
) => {
   return await axios.put<ResponseApi>('/api/perencanaan/data/tahapan', data)
}

export async function getTolalTahapan() {
   return axios
      .get<ResponseApi<{ totalCount: number; query: {} }>>(`/api/perencanaan/data/tahapan/total`)
      .then((res) => res?.data)
}

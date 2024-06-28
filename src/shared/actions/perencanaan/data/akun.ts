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
export type AkunParams = {
   id_akun: number
   is_bagi_hasil: number
   is_bankeu_khusus: number
   id_daerah?: number
   id_jns_dana?: number
   id_unik?: string
   is_bankeu_umum: number
   is_barjas: number
   is_bl: number
   is_bos: number
   is_btt: number
   is_bunga: number
   is_gaji_asn: number
   is_hibah_brg: number
   is_hibah_uang: number
   is_locked: number
   is_modal_tanah: number
   is_pembiayaan: number
   is_pendapatan: number
   is_sosial_brg: number
   is_sosial_uang: number
   is_subsidi: number
   is_tkdn: number
   set_input: number
   set_kab_kota: number
   set_prov: number
   tahun: number
   set_lokus?: string
}

export type GetAkunListParams = {
   tahun: number
   limit?: number
   search?: string
   after?: string
} & Omit<Partial<AkunParams>, 'tahun'>

export async function getListAkun(params: GetAkunListParams) {
   return axios
      .get<ResponseApi<CursorPaginate<Akun>>>(`api/perencanaan/master/akun`, { params })
      .then((res) => res?.data)
}
export async function getTolalAkun<T extends Partial<AkunParams>>(params: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`api/perencanaan/master/akun/total`, { params })
      .then((res) => res?.data)
}

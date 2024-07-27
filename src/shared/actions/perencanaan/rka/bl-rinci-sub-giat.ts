import axios from '@custom-axios/api-fetcher'
import {
   KetRinciBlSubGiat,
   KetRinciBlSubGiatDeleteByListIdValidationSchema,
   KetRinciBlSubGiatUncheckedCreateInput,
   RinciBlSubGiat,
   RinciBlSubGiatDeleteByListIdValidationSchema,
   RinciBlSubGiatUncheckedCreateInputSchema,
   SubsRinciBlSubGiat,
   SubsRinciBlSubGiatDeleteByListIdValidationSchema,
   SubsRinciBlSubGiatUncheckedCreateInputSchema,
} from '@zod'
import { postToSipd } from '@shared/custom-axios/sipd-fetcher'

export const viewListRinciBlSipd = async (payload: RinciBlSubGiatSipdPayload) =>
   await postToSipd('viewRinciBlSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_rinci_sub_bl'],
      params: payload,
   }).then((res) => res.data)
export const getListRinciBlDaerahSipd = async (payload: ListRinciBlSubGiatBySubBlSipdPayload) =>
   await postToSipd('listRinciBlSubGiat', {
      keys: ['id_daerah', 'tahun'],
      params: payload,
   }).then((res) => res.data)

export const getListRinciBlSubGiatSipd = async (payload: ListRinciBlSubGiatBySubBlSipdPayload) =>
   await postToSipd('listRinciBlSubGiatBySbl', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_unit', 'is_anggaran', 'id_jadwal'],
      params: payload,
   }).then((res) => res.data)

export const getListRinciBlSubGiatBySkpdSipd = async (
   payload: ListRinciBlSubGiatBySkpdSipdPayload
) =>
   await postToSipd('listRinciBlSubGiatBySkpd', {
      keys: ['id_daerah', 'tahun', 'id_skpd'],
      params: payload,
   }).then((res) => res.data)

export const getKetRinciBlSubGiatByDaerahSipd = async (
   payload: ListKetRinciBlSubGiatByDaerahSipdPayload
) =>
   await postToSipd('listKetRinciBlSubGiatByDaerah', {
      keys: ['id_daerah', 'tahun'],
      params: payload,
   }).then((res) => res.data)

export const getKetRinciBlSubGiatBySkpdSipd = async (
   payload: ListKetRinciBlSubGiatByDaerahSipdPayload
) => {
   const { data } = await postToSipd('listKetRinciBlSubGiatByDaerah', {
      keys: ['id_daerah', 'tahun'],
      params: payload,
   })
   const result = data.filter((d) => d.id_unit === payload.id_unit)
   return { data: result, recordsTotal: data.length, recordsFilter: result.length }
}

export const getKetRinciBlSubGiatByIdsSipd = async (
   payload: ListKetRinciBlSubGiatByIdListSipdPayload
) => {
   return await postToSipd('listKetRinciBlSubGiatByIdList', {
      keys: ['id_daerah', 'tahun', '__id_ket_sub_bl_list', 'is_anggaran'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data keterangan rincian belanja sub kegiatan dari sipd')
      })
}

export const addKetRinciBlSubGiatSipd = async (payload: AddKetRinciBlSubGiatSipdPayload) => {
   return await postToSipd('addKetRinciBlSubGiat', {
      keys: [
         'id_bl',
         'id_daerah',
         'id_daerah_log',
         'id_giat',
         'id_program',
         'id_skpd',
         'id_sub_bl',
         'id_sub_bl',
         'id_sub_giat',
         'id_sub_skpd',
         'id_unit',
         'id_user_log',
         'ket_bl_teks',
         'nama_daerah',
         'nama_giat',
         'nama_program',
         'nama_skpd',
         'nama_sub_giat',
         'nama_sub_skpd',
         'nama_unit',
         'tahun',
      ],
      params: payload,
   }).catch(() => {
      throw new Error('Gagal mengambil data keterangan rincian belanja sub kegiatan dari sipd')
   })
}

export const getSubsRinciBlSubGiatByIdsSipd = async (
   payload: ListSubsRinciBlSubGiatByIdListSipdPayload
) => {
   return await postToSipd('listSubsRinciBlSubGiatByIdList', {
      keys: ['id_daerah', 'tahun', '__id_subs_sub_bl_list', 'is_anggaran'],
      params: payload,
   }).then((res) => res.data)
}

export const getSubsRinciBlSubGiatByDaerahSipd = async (
   payload: ListSubsRinciBlSubGiatSipdPayload
) => {
   return await postToSipd('listSubsRinciBlSubGiat', {
      keys: ['id_daerah', 'tahun'],
      params: payload,
   }).then((res) => res.data)
}

export const getSubsRinciBlSubGiatBySkpdSipd = async (
   payload: ListSubsRinciBlSubGiatSipdPayload & { id_unit: number }
) => {
   const { data } = await postToSipd('listSubsRinciBlSubGiat', {
      keys: ['id_daerah', 'tahun'],
      params: payload,
   })
   const result = data.filter((d) => d.id_unit === payload.id_unit)
   return { data: result, recordsTotal: data.length, recordsFilter: result.length }
}

export type GetRinciListParams = {
   id_sub_bl?: number
   bl_sub_giat_id?: string
   jadwal_anggaran_id?: string
   id_daerah?: number
   tahun?: number
   id_skpd?: number
   id_sub_giat?: number
   id_unit?: number
}

export async function getTotalRinciBlSubGiat<T extends GetRinciListParams>(params?: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/rka/sub-giat/rinci/total`, { params })
      .then((res) => res?.data)
}

export type GetKetRinciListParams = {
   id_sub_bl: number
   id_daerah?: number | undefined
   tahun?: number | undefined
   id_skpd?: number | undefined
   id_sub_giat?: number | undefined
   id_unit?: number | undefined
}

export type PaginateKetRinciListParams = {
   limit?: number
   search?: string
   after?: string
} & GetKetRinciListParams

export const getKetRinciBlSubGiat = async (params: PaginateKetRinciListParams) =>
   await axios
      .get<ResponseApi<CursorPaginate<KetRinciBlSubGiat>>>(
         `/api/perencanaan/rka/sub-giat/rinci/ket`,
         {
            params,
         }
      )
      .then((res) => res.data)

export async function getTotalKetRinciBlSubGiat<T extends Partial<GetKetRinciListParams>>(
   params?: T
) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/rka/sub-giat/rinci/ket/total`, { params })
      .then((res) => res?.data)
}

export type GetSubsRinciListParams = {
   id_sub_bl: number
   id_daerah?: number | undefined
   tahun?: number | undefined
   id_skpd?: number | undefined
   id_sub_giat?: number | undefined
   id_unit?: number | undefined
}

export type PaginateSubsRinciListParams = {
   limit?: number
   search?: string
   after?: string
} & GetSubsRinciListParams

export const getSubsRinciBlSubGiat = async (params: PaginateSubsRinciListParams) =>
   await axios
      .get<ResponseApi<CursorPaginate<SubsRinciBlSubGiat>>>(
         `/api/perencanaan/rka/sub-giat/rinci/subs`,
         {
            params,
         }
      )
      .then((res) => res.data)

export async function getTotalSubsRinciBlSubGiat<T extends Partial<GetSubsRinciListParams>>(
   params?: T
) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/rka/sub-giat/rinci/subs/total`, { params })
      .then((res) => res?.data)
}

// SYNC RINCIAN

export async function syncKetRinciBlSubGiat(data: KetRinciBlSubGiatUncheckedCreateInput[]) {
   return await axios.put('/api/perencanaan/rka/sub-giat/rinci/ket', data)
}

export async function addKetRinciBlSubGiat(data: KetRinciBlSubGiatUncheckedCreateInput) {
   return await axios.post('/api/perencanaan/rka/sub-giat/rinci/ket', data)
}
export async function syncRinciBlSubGiat(
   data: Zod.infer<typeof RinciBlSubGiatUncheckedCreateInputSchema>[]
) {
   return await axios.put('/api/perencanaan/rka/sub-giat/rinci', data)
}

export async function syncSubsRinciBlSubGiat(
   data: Zod.infer<typeof SubsRinciBlSubGiatUncheckedCreateInputSchema>[]
) {
   return await axios.put('/api/perencanaan/rka/sub-giat/rinci/subs', data)
}

// Delete Data Kegiatan
export async function deleteRinciBlSubGiatByListId(
   payload: Zod.infer<typeof RinciBlSubGiatDeleteByListIdValidationSchema>
) {
   const data = RinciBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   await axios.delete(`/api/perencanaan/rka/sub-giat/rinci`, { data })
}
export async function deleteKetRinciBlSubGiatByListId(
   payload: Zod.infer<typeof KetRinciBlSubGiatDeleteByListIdValidationSchema>
) {
   const data = KetRinciBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   await axios.delete(`/api/perencanaan/rka/sub-giat/rinci/ket`, { data })
}

export async function deleteSubsRinciBlSubGiatByListId(
   payload: Zod.infer<typeof SubsRinciBlSubGiatDeleteByListIdValidationSchema>
) {
   const data = SubsRinciBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   await axios.delete(`/api/perencanaan/rka/sub-giat/rinci/subs`, { data })
}
export const getRinciSubGiatByBlSubgiatId = async (bl_sub_giat_id: string) =>
   await axios
      .get<
         ResponseApi<RinciBlSubGiat[]>
      >(`/api/perencanaan/rka/sub-giat/rinci`, { params: { bl_sub_giat_id } })
      .then((res) => res.data)

export interface SumberDanaAkunRinciSubGiat {
   bl_sub_giat_id: string
   nama_dana: string
   kode_akun: string
   id_dana: number
   total_harga: number
   total_harga_murni: number
}
export const getSumberDanaAkunRinciSubGiat = async (params: {
   jadwal_anggaran_id: string
   id_giat?: number
   id_program?: number
   id_skpd?: number
   id_sub_giat?: number
   id_sub_skpd?: number
   id_unit?: number
   id_bidang_urusan?: number
   id_urusan?: number
}) =>
   await axios
      .get<
         ResponseApi<SumberDanaAkunRinciSubGiat[]>
      >(`/api/perencanaan/rka/sub-giat/rinci/sumber-dana-akun`, { params })
      .then((res) => res.data)

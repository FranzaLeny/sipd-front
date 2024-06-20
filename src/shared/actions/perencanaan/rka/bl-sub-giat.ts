import {
   BlSubGiat,
   BlSubGiatAktif,
   BlSubGiatAktifDeleteByListIdValidationSchema,
   BlSubGiatAktifUncheckedCreateInputSchema,
   BlSubGiatDeleteByListIdValidationSchema,
   BlSubGiatUncheckedCreateInputSchema,
   DanaBlSubGiat,
   DanaBlSubGiatDeleteByListIdValidationSchema,
   DanaBlSubGiatUncheckedCreateInput,
   DanaBlSubGiatUncheckedCreateInputSchema,
   LabelBlSubGiatDeleteByListIdValidationSchema,
   LabelBlSubGiatUncheckedCreateInput,
   LabelBlSubGiatUncheckedCreateInputSchema,
   LokasiBlSubGiatDeleteByListIdValidationSchema,
   LokasiBlSubGiatUncheckedCreateInput,
   LokasiBlSubGiatUncheckedCreateInputSchema,
   OutputBlSubGiatDeleteByListIdValidationSchema,
   OutputBlSubGiatUncheckedCreateInput,
   OutputBlSubGiatUncheckedCreateInputSchema,
   TagBlSubGiatDeleteByListIdValidationSchema,
   TagBlSubGiatUncheckedCreateInput,
   TagBlSubGiatUncheckedCreateInputSchema,
} from '@zod'
import { groupBy, sum } from 'lodash-es'
import axios from '@shared/custom-axios/api-fetcher'
import { postToSipd } from '@shared/custom-axios/sipd-fetcher'
import { decryptBase64String } from '@shared/utils'
import { ResponseGetSubGiatWithRinci } from '@/types/api/bl-sub-giat'

// Ambil data

export interface SyncSubGiatParams {
   payload: BlSubGiatSipdPayload
   id_bl: number
   id_jadwal: number
   jadwal_anggaran_id: string
   kode_giat: string
   kode_sub_giat: string
   kode_program: string
   bl_giat_id: string
   bl_sub_giat_aktif_id: string
}

export interface SyncDetailSubGiatParams {
   payload: {
      id_bl: number
      id_jadwal: number
      kode_giat: string
      kode_program: string
      jadwal_anggaran_id: string
      payload: {
         tahun: number
         id_daerah: number
         id_unit: number
         is_anggaran: number
         id_sub_bl: number
      }
      kode_sub_giat: string
      bl_giat_id: string
      bl_sub_giat_aktif_id: string
   }
   bl_sub_giat_id: string
}

export interface GroupBlSubGiatAktifByGiatParams {
   jadwal: {
      jadwal_anggaran_id: string
      id_jadwal: number
      id_jadwal_murni?: number
      nama_jadwal_murni?: string
      jadwal_anggaran_murni_id?: string
   }
}

// GET DATA SIPD

export const getBlSubGiatAktifSipd = async (payload: ListBlSubGiatAktifSipdPayload) => {
   return await postToSipd('listBlSubGiatAktif', {
      keys: ['id_daerah', 'is_anggaran', 'tahun', 'id_unit', 'is_prop', 'id_jadwal'],
      params: payload,
   })
      .then((res) => decryptBase64String(res.data) as BlSubGiatAktifSipd[])
      .catch(() => {
         throw new Error('Gagal mengambil data belanja sub kegiatan aktif dari sipd')
      })
}

export const getAllBlSubGiatSkpdSipd = async (payload: BlSubGiatBySkpdSipdPayload) => {
   return await postToSipd('blSubGiatBySkpd', {
      keys: ['id_daerah', 'tahun', 'id_skpd', 'id_unit'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja sub kegiatan dari sipd')
      })
}
// export const getAllBlSubGiatSkpdSipd = async (payload: BlSubGiatBySkpdSipdPayload) => {
//    return await postToSipd('listBlSubGiatBySubSkpd', {
//       keys: ['id_daerah', 'tahun', 'id_skpd', 'id_unit'],
//       params: payload,
//    })
//       .then((res) => res.data)
//       .catch(() => {
//          throw new Error('Gagal mengambil data belanja sub kegiatan dari sipd')
//       })
// }

export const getBlSubGiatSipd = async (payload: BlSubGiatSipdPayload) => {
   return await postToSipd('blSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_jadwal', 'id_unit', 'is_anggaran'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja sub kegiatan dari sipd')
      })
}

export const getDanaBlSubGiatSipd = async (payload: ListDanaBlSubGiatSipdPayload) => {
   return await postToSipd('listDanaBlSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_jadwal'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data dana belanja sub kegiatan dari sipd')
      })
}

export const getLabelBlSubGiatSipd = async (payload: ListLabelBlSubGiatSipdPayload) => {
   return await postToSipd('listLabelBlSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_jadwal'],
      params: payload,
   })
      .then((res) => {
         return res.data
      })
      .catch(() => {
         throw new Error('Gagal mengambil data label belanja sub kegiatan dari sipd')
      })
}

export const getLokasiBlSubGiatSipd = async (payload: ListLokasiBlSubGiatSipdPayload) => {
   return await postToSipd('listLokasiBlSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_jadwal'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data lokasi belanja sub kegiatan dari sipd')
      })
}

export const getOutputBlSubGiatSipd = async (payload: ListOutputBlSubGiatSipdPayload) => {
   return await postToSipd('listOutputBlSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_jadwal'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data output belanja sub kegiatan dari sipd')
      })
}

export const getTagBlSubGiatSipd = async (payload: ListTagBlSubGiatSipdPayload) => {
   return await postToSipd('listTagBlSubGiat', {
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_jadwal'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data tag belanja sub kegiatan dari sipd')
      })
}

// GET DATA LOKAL
export type GetSubGiatListParams = {
   tahun?: number
   id_daerah?: number
   id_skpd?: number
   id_unit: number
   jadwal_anggaran_id: string
}

export const getAllSubBlAktif = async (params: GetSubGiatListParams) => {
   const { data } = await axios.get<
      ResponseApi<(BlSubGiatAktif & { bl_sub_giat: { id: string; bl_giat_id: string | null }[] })[]>
   >(`api/perencanaan/rka/sub-giat/aktif/all`, { params })
   return data
}

export async function getTotalBlSubGiatAktif<T extends Partial<GetSubGiatListParams>>(params?: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`api/perencanaan/rka/sub-giat/aktif/total`, { params })
      .then((res) => res?.data)
}
export async function getBlSubGiatByJadwalUnit(params: GetSubGiatListParams) {
   return axios
      .get<ResponseApi<BlSubGiat[]>>(`api/perencanaan/rka/sub-giat/get-by-jadwal-unit`, { params })
      .then((res) => res?.data)
}

export async function groupBlSubGiatAktifByGiat(
   params: GroupBlSubGiatAktifByGiatParams &
      ListBlSubGiatAktifSipdPayload & { onlyPaguMurni: boolean }
) {
   try {
      const { jadwal, id_daerah, id_unit, is_prop, tahun, onlyPaguMurni } = params
      const subGiats = await getBlSubGiatAktifSipd({
         id_daerah,
         id_unit,
         is_prop,
         tahun,
         is_anggaran: 1,
      }).then((data) => {
         if (!data?.length) {
            throw new Error('Data sub kegian tidak ditemukan')
         }
         if (onlyPaguMurni) {
            data = data.filter((d) => !!d.pagu_murni)
         }
         const { jadwal_anggaran_murni_id } = jadwal
         const _temp = jadwal_anggaran_murni_id
            ? { jadwal_anggaran_murni_id }
            : {
                 id_jadwal_murni: 0,
                 jadwal_anggaran_murni_id: null,
                 pagu_murni: null,
                 nama_jadwal_murni: null,
              }
         return data.map((d) => {
            if (onlyPaguMurni) {
               const giat = data.filter((i) => i.kode_bl === d.kode_bl).map((d) => d.pagu_murni)
               d.pagu = d.pagu_murni ?? 0
               d.pagu_indikatif = d.pagu_murni ?? 0
               d.rincian = d.pagu_murni ?? 0
               d.rinci_giat = sum(giat)
            }
            return {
               ...d,
               ...jadwal,
               ..._temp,
            }
         })
      })
      const groupedByGiat = groupBy(subGiats, 'id_giat')
      return { totalSub: subGiats.length, groupedByGiat }
   } catch (error: any) {
      throw new Error(error?.message ?? 'Gagal belanja sub kegiatan dari sipd')
   }
}

// Singkron data

export const syncSubBlAktif = async (
   subBlAktif: Zod.infer<typeof BlSubGiatAktifUncheckedCreateInputSchema>
) => {
   const data = BlSubGiatAktifUncheckedCreateInputSchema.parse(subBlAktif)
   return await axios
      .put<
         ResponseApi<{
            id: string
            nama_sub_giat: string
         }>
      >('api/perencanaan/rka/sub-giat/aktif', data)
      .then((res) => res.data)
}

export interface SubBlByUnit {
   id: string
   nama_sub_giat: string
   tahun: number
   jadwal_anggaran_id: string
   bl_giat_id: string
   bl_sub_giat_aktif_id: string
}
export const getSubBlByUnit = async (params: {
   id_unit: number
   id_skpd: number
   jadwal_anggaran_id: string
}) => {
   return await axios
      .get<ResponseApi<SubBlByUnit[]>>('api/perencanaan/rka/sub-giat/by-unit', { params })
      .then((res) => res?.data)
}

export const syncBlSubGiat = async (
   params: SyncSubGiatParams & {
      jadwal_anggaran_murni_id?: string | null
      staticData?: {
         pagu?: number | null
         pagu_indikatif?: number | null
         pagu_murni?: number | null
      }
      subGiat: BlSubGiatSipd
   }
) => {
   try {
      const { payload, subGiat = {}, staticData, ...other } = params

      const data = BlSubGiatUncheckedCreateInputSchema.parse({
         ...subGiat,
         ...other,
         ...staticData,
      })
      const res = await axios
         .put<{
            data: { id: string; nama_sub_giat: string; id_sub_bl: string }
         }>('api/perencanaan/rka/sub-giat', data)
         .then((res) => res.data)
      return res
   } catch (error) {
      throw new Error('Gagal singkron data sub kegiatan')
   }
}

export const syncDanaBlSubGiat = async (data: DanaBlSubGiatUncheckedCreateInput[]) => {
   const validaData = DanaBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`api/perencanaan/rka/sub-giat/dana`, validaData)
}

export const syncLabelSubGiat = async (data: LabelBlSubGiatUncheckedCreateInput[]) => {
   const validaData = LabelBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`api/perencanaan/rka/sub-giat/label`, validaData)
}

export const syncLokasiSubGiat = async (data: LokasiBlSubGiatUncheckedCreateInput[]) => {
   const validaData = LokasiBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`api/perencanaan/rka/sub-giat/lokasi`, validaData)
}

export const syncOutputSubGiat = async (data: OutputBlSubGiatUncheckedCreateInput[]) => {
   const validaData = OutputBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`api/perencanaan/rka/sub-giat/output`, validaData)
}
export const syncTagSubGiat = async (data: TagBlSubGiatUncheckedCreateInput[]) => {
   const validaData = TagBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`api/perencanaan/rka/sub-giat/tag`, validaData)
}

export async function getDetailSubGiatSipd(
   args: SyncDetailSubGiatParams['payload'] & { bl_sub_giat_id: string }
) {
   const { payload, ...other } = args
   const tag = getTagBlSubGiatSipd(payload).then((res) =>
      res.map((d) => ({ ...d, ...payload, ...other }))
   )
   const output = getOutputBlSubGiatSipd(payload).then((res) =>
      res.map((d) => ({ ...d, ...payload, ...other }))
   )
   const lokasi = getLokasiBlSubGiatSipd(payload).then((res) =>
      res.map((d) => ({ ...d, ...payload, ...other }))
   )
   const label = getLabelBlSubGiatSipd(payload).then((res) =>
      res.map((d) => ({ ...d, ...payload, ...other }))
   )
   const dana = getDanaBlSubGiatSipd(payload).then((res) =>
      res.map((d) => ({ ...d, id_dana: Number(d.id_dana), ...payload, ...other }))
   )

   const [tagBlSubGiat, outputBlSubGiat, lokasiBlSubGiat, labelBlSubGiat, danaBlSubGiat] =
      await Promise.all([tag, output, lokasi, label, dana]).catch(() => [[], [], [], [], []])
   return { tagBlSubGiat, outputBlSubGiat, lokasiBlSubGiat, labelBlSubGiat, danaBlSubGiat }
}

// DELETE LOKAL

export async function deleteBlSubGiatByListId(
   payload: Zod.infer<typeof BlSubGiatDeleteByListIdValidationSchema>
) {
   const data = BlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`api/perencanaan/rka/sub-giat`, { data })
}

export async function deleteBlSubGiatAktifByListId(
   payload: Zod.infer<typeof BlSubGiatAktifDeleteByListIdValidationSchema>
) {
   const data = BlSubGiatAktifDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`api/perencanaan/rka/sub-giat/aktif`, { data })
}

export async function deleteDanaBlSubGiatByListId(
   payload: Zod.infer<typeof DanaBlSubGiatDeleteByListIdValidationSchema>
) {
   const data = DanaBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`api/perencanaan/rka/sub-giat/dana`, { data })
}

export async function deleteLabelBlSubGiatByListId(
   payload: Zod.infer<typeof LabelBlSubGiatDeleteByListIdValidationSchema>
) {
   const data = LabelBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`api/perencanaan/rka/sub-giat/label`, { data })
}

export async function deleteLokasiBlSubGiatByListId(
   payload: Zod.infer<typeof LokasiBlSubGiatDeleteByListIdValidationSchema>
) {
   const data = LokasiBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`api/perencanaan/rka/sub-giat/lokasi`, {
      data,
   })
}

export async function deleteOutputBlSubGiatByListId(
   payload: Zod.infer<typeof OutputBlSubGiatDeleteByListIdValidationSchema>
) {
   const data = OutputBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`api/perencanaan/rka/sub-giat/output`, {
      data,
   })
}

export async function deleteTagBlSubGiatByListId(
   payload: Zod.infer<typeof TagBlSubGiatDeleteByListIdValidationSchema>
) {
   const data = TagBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`api/perencanaan/rka/sub-giat/tag`, {
      data,
   })
}
export type GetDanaListParams = {
   limit?: number
   search?: string
   after?: string
} & Partial<DanaBlSubGiat>

export const getDanaBlSubGiat = async (params: GetDanaListParams) =>
   await axios
      .get<ResponseApi<CursorPaginate<DanaBlSubGiat>>>(`api/perencanaan/rka/sub-giat/dana`, {
         params,
      })
      .then((res) => res.data)

export const getBlSubGiatById = async <U extends true | undefined = undefined>(
   id: string,
   with_rinci?: U,
   unik?: { jadwal_anggaran_id: string; id_unit: number }
) => {
   const params = !!with_rinci ? { with_rinci } : unik ? { ...unik } : undefined
   const { data } = await axios.get<
      ResponseApi<U extends true ? ResponseGetSubGiatWithRinci : BlSubGiat>
   >(`api/perencanaan/rka/sub-giat/${id}`, {
      params,
   })
   return data
}

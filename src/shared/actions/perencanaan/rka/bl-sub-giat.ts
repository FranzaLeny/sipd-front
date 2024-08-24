import {
   BlSubGiatAktifDeleteByListIdValidationSchema,
   BlSubGiatAktifUncheckedCreateInputSchema,
   BlSubGiatDeleteByListIdValidationSchema,
   BlSubGiatUncheckedCreateInputSchema,
   DanaBlSubGiatDeleteByListIdValidationSchema,
   DanaBlSubGiatUncheckedCreateInputSchema,
   LabelBlSubGiatDeleteByListIdValidationSchema,
   LabelBlSubGiatUncheckedCreateInputSchema,
   LokasiBlSubGiatDeleteByListIdValidationSchema,
   LokasiBlSubGiatUncheckedCreateInputSchema,
   OutputBlSubGiatDeleteByListIdValidationSchema,
   OutputBlSubGiatUncheckedCreateInputSchema,
   TagBlSubGiatDeleteByListIdValidationSchema,
   TagBlSubGiatUncheckedCreateInputSchema,
} from '@zod'
import { groupBy, sum } from 'lodash-es'
import axios from '@shared/custom-axios/api-fetcher'
import { postToSipd } from '@shared/custom-axios/sipd-fetcher'
import { decryptBase64String } from '@shared/utils'

// Ambil data

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
      keys: ['id_daerah', 'tahun', 'id_sub_bl', 'id_jadwal', 'is_anggaran'],
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

export const getAllSubBlAktif = async (params: GetBlSubGiatParams) => {
   const { data } = await axios.get<
      ResponseApi<(BlSubGiatAktif & { bl_sub_giat: { id: string; bl_giat_id: string | null }[] })[]>
   >(`/api/perencanaan/rka/sub-giat/aktif/all`, { params })
   return data
}

export async function getTotalBlSubGiatAktif<T extends Partial<GetBlSubGiatParams>>(params?: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/rka/sub-giat/aktif/total`, { params })
      .then((res) => res?.data)
}

export async function getAllBlSubGiat(params: GetAllBlSubGiatParams) {
   return axios
      .get<ResponseApi<BlSubGiat[]>>(`/api/perencanaan/rka/sub-giat/all`, { params })
      .then((res) => res?.data)
}

export async function getRealisasiSubGiat(params: GetBlSubGiatParams) {
   return axios
      .get<ResponseApi<RealisasiSubGiat[]>>(`/api/perencanaan/rka/sub-giat/realisasi`, { params })
      .then((res) => res?.data)
}

export async function groupBlSubGiatAktifByGiat(params: GroupBlSubGiatAktifByGiatParams) {
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

export const syncSubBlAktif = async (subBlAktif: BlSubGiatAktifUncheckedCreateInput) => {
   const data = BlSubGiatAktifUncheckedCreateInputSchema.parse(subBlAktif)
   return await axios
      .put<
         ResponseApi<{
            id: string
            nama_sub_giat: string
         }>
      >('/api/perencanaan/rka/sub-giat/aktif', data)
      .then((res) => res.data)
}

export const syncBlSubGiat = async (params: SyncBlSubGiatParams) => {
   try {
      const { payload, subGiat = {}, staticData, ...other } = params
      console.log({ subGiat, staticData, other })

      const data = BlSubGiatUncheckedCreateInputSchema.parse({
         ...subGiat,
         ...other,
         ...staticData,
      })
      console.log({ data })

      const res = await axios
         .put<{
            data: { id: string; nama_sub_giat: string; id_sub_bl: string }
         }>('/api/perencanaan/rka/sub-giat', data)
         .then((res) => res.data)
      return res
   } catch (error) {
      console.log({ error })

      throw new Error('Gagal singkron data sub kegiatan')
   }
}

export const syncDanaBlSubGiat = async (data: DanaBlSubGiatUncheckedCreateInput[]) => {
   const validaData = DanaBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`/api/perencanaan/rka/sub-giat/dana`, validaData)
}

export const syncLabelSubGiat = async (data: LabelBlSubGiatUncheckedCreateInput[]) => {
   const validaData = LabelBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`/api/perencanaan/rka/sub-giat/label`, validaData)
}

export const syncLokasiSubGiat = async (data: LokasiBlSubGiatUncheckedCreateInput[]) => {
   const validaData = LokasiBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`/api/perencanaan/rka/sub-giat/lokasi`, validaData)
}

export const syncOutputSubGiat = async (data: OutputBlSubGiatUncheckedCreateInput[]) => {
   const validaData = OutputBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`/api/perencanaan/rka/sub-giat/output`, validaData)
}
export const syncTagSubGiat = async (data: TagBlSubGiatUncheckedCreateInput[]) => {
   const validaData = TagBlSubGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`/api/perencanaan/rka/sub-giat/tag`, validaData)
}

export async function getDetailSubGiatSipd(params: GetDetailSubGiatSipdParams) {
   const { payload, ...other } = params
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

export async function deleteBlSubGiatByListId(payload: BlSubGiatDeleteByListIdParams) {
   const data = BlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`/api/perencanaan/rka/sub-giat`, { data })
}

export async function deleteBlSubGiatAktifByListId(payload: BlSubGiatAktifDeleteByListIdParams) {
   const data = BlSubGiatAktifDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`/api/perencanaan/rka/sub-giat/aktif`, { data })
}

export async function deleteDanaBlSubGiatByListId(payload: DanaBlSubGiatDeleteByListIdParams) {
   const data = DanaBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`/api/perencanaan/rka/sub-giat/dana`, { data })
}

export async function deleteLabelBlSubGiatByListId(payload: LabelBlSubGiatDeleteByListIdParams) {
   const data = LabelBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`/api/perencanaan/rka/sub-giat/label`, { data })
}

export async function deleteLokasiBlSubGiatByListId(payload: LokasiBlSubGiatDeleteByListIdParams) {
   const data = LokasiBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`/api/perencanaan/rka/sub-giat/lokasi`, {
      data,
   })
}

export async function deleteOutputBlSubGiatByListId(payload: OutputBlSubGiatDeleteByListIdParams) {
   const data = OutputBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`/api/perencanaan/rka/sub-giat/output`, {
      data,
   })
}

export async function deleteTagBlSubGiatByListId(payload: TagBlSubGiatDeleteByListIdParams) {
   const data = TagBlSubGiatDeleteByListIdValidationSchema.parse(payload)
   return await axios.delete(`/api/perencanaan/rka/sub-giat/tag`, {
      data,
   })
}

export const getDanaBlSubGiat = async (params: GetListDanaParams) =>
   await axios
      .get<ResponseApi<CursorPaginate<DanaBlSubGiat>>>(`/api/perencanaan/rka/sub-giat/dana`, {
         params,
      })
      .then((res) => res.data)

export const getBlSubGiatById = async <U extends true | undefined = undefined>(
   id: string,
   with_rinci?: U
) => {
   const params = !!with_rinci ? { with_rinci } : undefined
   const { data } = await axios.get<ResponseApi<U extends true ? SubGiatWithRinci : BlSubGiat>>(
      `/api/perencanaan/rka/sub-giat/${id}`,
      {
         params,
      }
   )
   return data
}
export const getBlSubGiatByKodeSbl = async <U extends true | undefined = undefined>(
   params: GetBlSubGiatByKodeSblParams<U>
) => {
   const { data } = await axios.get<ResponseApi<U extends true ? SubGiatWithRinci : BlSubGiat>>(
      `/api/perencanaan/rka/sub-giat/get-by-kode-sbl`,
      {
         params,
      }
   )
   return data
}

import { getJadwaPergeseranDpaFromSipd } from '@actions/penatausahaan/pengeluaran/jadwal'
import {
   JadwalAnggaranSchema,
   JadwalAnggaranUncheckedCreateInputSchema,
   JadwalAnggaranUncheckedUpdateInputSchema,
} from '@zod'
import axios from '@shared/custom-axios/api-fetcher'
import { postToSipd } from '@shared/custom-axios/sipd-fetcher'
import { revalidate } from '@shared/server-actions/revalidate'

import { Tahapan } from '../data/tahapan'

export type JadwalAnggaran = Zod.infer<typeof JadwalAnggaranSchema> & {
   tahapan: Tahapan
   jadwal_murni: {
      id: string
      id_jadwal: number
      nama_sub_tahap: string
   } | null
}
// SIPD
export const getJadwalAnggaranFromSipd = async (payload: ListJadwalAnggranSipdPayload) => {
   return await postToSipd('listJadwalAnggaran', {
      keys: ['id_daerah', 'tahun'],
      params: payload,
   }).then((res) => res.data)
}

export const getJadwalAnggaranAktifFromSipd = async (params: JadwalAnggranCekAktifSipdPayload) => {
   return await postToSipd('jadwalAnggaranAktif', {
      keys: ['id_daerah', 'is_anggaran', 'tahun'],
      params,
   }).then((res) => res.data)
}

// LOKAL
export const getJadwalAnggaranById = async (
   id: string | number,
   params?: { byIdUnik?: boolean; byIdJadwal?: boolean }
) => {
   return await axios.get<ResponseApi<JadwalAnggaran>>(`api/perencanaan/rka/jadwal/${id}`, {
      params,
   })
}

export const createJadwalAnggaran = async (
   data: Zod.infer<typeof JadwalAnggaranUncheckedCreateInputSchema>
) => {
   const valid = JadwalAnggaranUncheckedCreateInputSchema.parse(data)
   return await axios.post<ResponseApi<JadwalAnggaran>>(`api/perencanaan/rka/jadwal`, valid)
}

export const updateJadwalAnggaran = async (
   id: string,
   data: Zod.infer<typeof JadwalAnggaranUncheckedUpdateInputSchema>,
   isIdUnik = false
) => {
   const valid = JadwalAnggaranUncheckedUpdateInputSchema.parse(data)
   return await axios.patch<ResponseApi<JadwalAnggaran>>(
      `api/perencanaan/rka/jadwal/${id}${isIdUnik ? '/by-id-unik' : ''}`,
      valid
   )
}
export const updateJadwalAnggaranPenatausahaan = async (
   id_sipd: number,
   data: Zod.infer<typeof JadwalAnggaranUncheckedUpdateInputSchema>
) => {
   const valid = JadwalAnggaranUncheckedUpdateInputSchema.parse(data)
   return await axios.patch<ResponseApi>(
      `api/perencanaan/rka/jadwal/${id_sipd}/penatausahaan`,
      valid
   )
}

export const deleteJadwalAnggaran = async (id: string) => {
   return await axios.delete<ResponseApi<JadwalAnggaran>>(`api/perencanaan/rka/jadwal/${id}`)
}

export type GetJadwalAnggaranParams = {
   id?: string | undefined
   id_daerah?: number | undefined
   id_jadwal?: number | undefined
   tahun?: number | undefined
}

export const getJadwalAnggaran = async (
   params: GetJadwalAnggaranParams & {
      limit: number
      search?: string
      orderBy?: string
   }
) => {
   return await axios.get<ResponseApi<CursorPaginate<JadwalAnggaran>>>(
      'api/perencanaan/rka/jadwal',
      {
         params: { orderBy: '-waktu_selesai', ...params },
      }
   )
}

export const getAllJadwalAnggaran = async (
   params: GetJadwalAnggaranParams & {
      hasPendapatan?: 'true' | 'false'
      hasRincian?: 'true' | 'false'
      hasSubGiat?: 'true' | 'false'
      orderBy?: string[] | string
   }
) => {
   return await axios.get<ResponseApi<JadwalAnggaran[]>>('api/perencanaan/rka/jadwal/all', {
      params,
      paramsSerializer: {
         indexes: null, // by default: false
      },
   })
}
export type AllJadwalAnggaranRakParams = {
   id_daerah: number
   tahun: number
   id_unit?: number
   id_sub_skpd?: number
   id_bidang_urusan?: number
   id_giat?: number
   id_program?: number
   id_skpd?: number
   id_sub_giat?: number
   id_urusan?: number
}

export const getAllJadwalAnggaranRak = async (params: AllJadwalAnggaranRakParams) => {
   return await axios.get<ResponseApi<JadwalAnggaran[]>>('api/perencanaan/rka/jadwal/has-rak', {
      params,
      paramsSerializer: {
         indexes: null, // by default: false
      },
   })
}

export const getAllJadwalAnggaranPenatausahaan = async (params: AllJadwalAnggaranRakParams) => {
   return await axios
      .get<ResponseApi<JadwalAnggaran[]>>('api/perencanaan/rka/jadwal/penatausahaan', {
         params,
         paramsSerializer: {
            indexes: null, // by default: false
         },
      })
      .then((d) => d.data)
}

export async function getTotalJadwalAnggaran<T extends GetJadwalAnggaranParams>(params?: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`api/perencanaan/rka/jadwal/total`, { params })
      .then((res) => res?.data)
}

type GetJadwalAnggaranAktifParams = {
   id_daerah: number
   tahun: number
   id_jadwal?: number | undefined
   is_lokal?: boolean | undefined
}

export const getJadwalAnggaranAktif = async (params: GetJadwalAnggaranAktifParams) => {
   return await axios.get<ResponseApi<JadwalAnggaran | null>>(`api/perencanaan/rka/jadwal/aktif`, {
      params,
   })
}

export const checkJadwalAnggaranAktif = async (
   params: JadwalAnggranCekAktifSipdPayload & { is_lokal?: boolean }
) => {
   if (!!params.is_lokal) {
      return await getJadwalAnggaranAktif(params).then((res) => res.data)
   }
   const jadwal_sipd = await getJadwalAnggaranAktifFromSipd(params).catch((e: any) => {
      throw new Error('Gagal mengambil data jadwal dari sipd')
   })

   const jadwal_lokal = await getJadwalAnggaranAktif({
      tahun: jadwal_sipd[0].tahun,
      id_daerah: params.id_daerah,
   })

   if (jadwal_lokal?.data?.is_active) {
      return jadwal_lokal?.data
   }
   return null
}

// OTHER

export async function syncJadwalAnggaranSipd(
   data: Zod.infer<typeof JadwalAnggaranUncheckedCreateInputSchema>[]
) {
   const res = await axios.put<ResponseApi>('api/perencanaan/rka/jadwal', data)
   await revalidate('jadwal_anggaran')
   return res
}

export async function syncJadwalAnggaranAktifSipd(
   data: Zod.infer<typeof JadwalAnggaranUncheckedCreateInputSchema>
) {
   const res = await axios.put<ResponseApi>(
      `api/perencanaan/rka/jadwal/${data.id_unik}/by-id-unik`,
      data
   )
   await revalidate('jadwal_anggaran')
   return res
}

export async function syncJadwalAnggaranPenatausahaan(data: { id_daerah: number; tahun: number }) {
   try {
      const jadwalKeu = await getJadwaPergeseranDpaFromSipd()
      for await (const jadwal of jadwalKeu) {
         const { id_jadwal, id_jadwal_sipd, jadwal_sipd_penatausahaan } = jadwal
         await updateJadwalAnggaranPenatausahaan(id_jadwal_sipd, {
            jadwal_penatausahaan: jadwal_sipd_penatausahaan,
            id_jadwal_penatausahaan: id_jadwal,
            ...data,
         })
      }
   } catch (error) {
      throw new Error('Gagal update Jadwal Anggaran Penatausahaan')
   }
}

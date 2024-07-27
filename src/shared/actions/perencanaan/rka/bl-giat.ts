import { postToSipd } from '@custom-axios/sipd-fetcher'
import {
   BlGiatDeleteByListIdValidationSchema,
   BlGiatUncheckedCreateInputSchema,
   CapaianBlGiatDeleteByListIdValidationSchema,
   CapaianBlGiatUncheckedCreateInput,
   CapaianBlGiatUncheckedCreateInputSchema,
   HasilBlGiatDeleteByListIdValidationSchema,
   HasilBlGiatUncheckedCreateInput,
   HasilBlGiatUncheckedCreateInputSchema,
   OutputBlGiatDeleteByListIdValidationSchema,
   OutputBlGiatUncheckedCreateInput,
   OutputBlGiatUncheckedCreateInputSchema,
} from '@zod'
import axios from '@shared/custom-axios/api-fetcher'

// Ambil data kegiatan dari sipd
export interface SyncDetailGiatParams {
   payload: BlGiatSipdPayload
   id_bl: number
   id_jadwal: number
   jadwal_anggaran_id: string
   bl_giat_id: string
}

interface SyncDataGiatParams {
   payload: BlGiatSipdPayload
   bl_giat: Pick<
      Zod.infer<typeof BlGiatUncheckedCreateInputSchema>,
      Exclude<keyof Zod.infer<typeof BlGiatUncheckedCreateInputSchema>, keyof BlGiatSipd>
   >
}

export const getBlGiatSipd = async (payload: BlGiatSipdPayload) => {
   return await postToSipd('blGiat', {
      keys: ['id_daerah', 'id_giat', 'id_program', 'id_skpd', 'id_sub_skpd', 'id_unit', 'tahun'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja kegiatan dari sipd')
      })
}

export const getBlGiatByDaerahSipd = async (payload: ListBySkpdPayload): Promise<any> => {
   try {
      const response = await postToSipd('listBlGiatSkpd', {
         keys: ['id_daerah', 'id_skpd', 'id_unit', 'tahun'],
         params: payload,
      })
      return response.data
   } catch (error) {
      throw new Error('Gagal mengambil data belanja kegiatan dari sipd')
   }
}

export const getListLabelBlGiatByDaerahSipd = async (
   payload: ListLabelBlGiatDaerahSipdPayload
): Promise<any> => {
   try {
      const response = await postToSipd('listLabelBlGiatDaerah', {
         keys: ['id_daerah', 'tahun', 'start', 'length'],
         params: payload,
      })
      return response
   } catch (error) {
      throw new Error('Gagal mengambil data list label belanja kegiatan dari sipd')
   }
}

export const getCapaianBlGiatSipdByGiat = async (payload: ListCapaianBlGiatByGiatSipdPayload) => {
   return await postToSipd('listCapaianBlGiatByGiat', {
      keys: ['id_daerah', 'id_giat', 'id_program', 'id_skpd', 'id_sub_skpd', 'id_unit', 'tahun'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data capaian belanja kegiatan dari sipd')
      })
}

export const getCapaianBlGiatByDaerahSipd = async (payload: ListBySkpdPayload) => {
   return await postToSipd('listCapaianBlGiatDaerah', {
      keys: ['id_daerah', 'id_skpd', 'id_unit', 'tahun'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja kegiatan dari sipd')
      })
}

export const getHasilBlGiatSipdByGiat = async (payload: ListHasilBlGiatByGiatSipdPayload) => {
   return await postToSipd('listHasilBlGiatByGiat', {
      keys: ['id_daerah', 'id_giat', 'id_program', 'id_skpd', 'id_sub_skpd', 'id_unit', 'tahun'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data hasil belanja kegiatan dari sipd')
      })
}

export const getHasilBlGiatByDaerahSipd = async (payload: ListBySkpdPayload) => {
   return await postToSipd('listHasilBlGiatDaerah', {
      keys: ['id_daerah', 'id_skpd', 'id_unit', 'tahun'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja kegiatan dari sipd')
      })
}

export const getOutputBlGiatByDaerahSipd = async (payload: ListBySkpdPayload) => {
   return await postToSipd('listOutputBlGiatDaerah', {
      keys: ['id_daerah', 'id_skpd', 'id_unit', 'tahun'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data belanja kegiatan dari sipd')
      })
}

export const getOutputBlGiatSipdByGiat = async (payload: ListOutputBlGiatByGiatSipdPayload) => {
   return await postToSipd('listOutputBlGiatByGiat', {
      keys: ['id_daerah', 'id_giat', 'id_program', 'id_skpd', 'id_sub_skpd', 'id_unit', 'tahun'],
      params: payload,
   })
      .then((res) => res.data)
      .catch(() => {
         throw new Error('Gagal mengambil data output belanja kegiatan dari sipd')
      })
}

// Sync data kegiatan
export const syncDataGiat = async ({ payload, bl_giat }: SyncDataGiatParams) => {
   const data_sipd = await getBlGiatSipd(payload).catch(() => {
      throw new Error('Gagal mengambil kegiatan dari sipd')
   })
   const data = BlGiatUncheckedCreateInputSchema.parse({ ...bl_giat, ...data_sipd })
   return await axios
      .put<
         ResponseApi<{
            id: string
            id_bl: number
            id_giat: number
            id_jadwal: number | null
            jadwal_anggaran_id: string
         }>
      >('/api/perencanaan/rka/giat', data)
      .then((res) => res.data)
}

export const syncCapaianBlGiat = async (data: CapaianBlGiatUncheckedCreateInput[]) => {
   const validData = CapaianBlGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`/api/perencanaan/rka/giat/capaian`, validData)
}

export const syncHasilBlGiat = async (data: HasilBlGiatUncheckedCreateInput[]) => {
   const validData = HasilBlGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`/api/perencanaan/rka/giat/hasil`, validData)
}

export const syncOutputBlGiat = async (data: OutputBlGiatUncheckedCreateInput[]) => {
   const validData = OutputBlGiatUncheckedCreateInputSchema.array().min(1).parse(data)
   return await axios.put(`/api/perencanaan/rka/giat/output`, validData)
}

export async function getDetailGiatSipd({ payload, ...other }: SyncDetailGiatParams) {
   const output = getOutputBlGiatSipdByGiat(payload).then((res) =>
      res.map((d) => ({ ...d, ...other }))
   )
   const hasil = getHasilBlGiatSipdByGiat(payload).then((res) =>
      res.map((d) => ({ ...d, ...other }))
   )
   const capaian = getCapaianBlGiatSipdByGiat(payload).then((res) =>
      res.map((d) => ({ ...d, ...other }))
   )

   const [outputGiat, hasilGiat, capaianGiat] = await Promise.all([output, hasil, capaian]).catch(
      () => [[], [], []]
   )
   return { outputGiat, hasilGiat, capaianGiat }
}

//GET
export async function getBlGiatById(id: string) {
   return await axios.get<ResponseApi>(`/api/perencanaan/rka/giat/${id}`)
}
// Delete Data Kegiatan
export async function deleteBlGiatByListId(
   payload: Zod.infer<typeof BlGiatDeleteByListIdValidationSchema>
) {
   const data = BlGiatDeleteByListIdValidationSchema.parse(payload)
   await axios.delete(`/api/perencanaan/rka/giat`, { data })
}
export async function deleteOutputBlGiatByListId(
   payload: Zod.infer<typeof OutputBlGiatDeleteByListIdValidationSchema>
) {
   const data = OutputBlGiatDeleteByListIdValidationSchema.parse(payload)
   await axios.delete(`/api/perencanaan/rka/giat/output`, { data })
}

export async function deleteCapaianBlGiatByListId(
   payload: Zod.infer<typeof CapaianBlGiatDeleteByListIdValidationSchema>
) {
   const data = CapaianBlGiatDeleteByListIdValidationSchema.parse(payload)
   await axios.delete(`/api/perencanaan/rka/giat/capaian`, { data })
}

export async function deleteHasilBlGiatByListId(
   payload: Zod.infer<typeof HasilBlGiatDeleteByListIdValidationSchema>
) {
   const data = HasilBlGiatDeleteByListIdValidationSchema.parse(payload)
   await axios.delete(`/api/perencanaan/rka/giat/hasil`, { data })
}

//CLONE DATA

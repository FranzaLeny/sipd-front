import axios from '@shared/custom-axios/api-fetcher'
import { postToSipd } from '@shared/custom-axios/sipd-fetcher'
import { tipeToKelompok } from '@shared/utils/standar-harga'

export const TIPES: ('SSH' | 'HSPK' | 'ASB' | 'SBU')[] = ['ASB', 'HSPK', 'SBU', 'SSH']
export const getListStandarHargaSipd = async (params: ListStandarHargaSipdPayload) => {
   let kelompok: ListStandarHargaSipdPayload['kelompok'] = tipeToKelompok(params.tipe)
   return await postToSipd('listStandarHarga', {
      keys: ['id_daerah', 'kelompok', 'length', 'start', 'tahun', 'tipe'],
      params: { ...params, kelompok },
   }).then((res) => {
      return res.data
   })
}

export const getStandarHargaSipdFromExport = async (
   params: Omit<StandarHargaExportExcelSipdPayload, 'kelompok'>
) => {
   let kelompok: ListStandarHargaSipdPayload['kelompok'] = tipeToKelompok(params.tipe)
   return await postToSipd('standarHargaExportExcel', {
      keys: ['id_daerah', 'kelompok', 'tahun', 'tipe'],
      params: { ...params, kelompok },
   }).then((res) => res.data)
}

export const getAllStandarHargaSipd = async (
   params: Omit<ListStandarHargaSipdPayload, 'kelompok'>
) => {
   let kelompok: ListStandarHargaSipdPayload['kelompok'] = tipeToKelompok(params.tipe)
   return await getListStandarHargaSipd({ ...params, kelompok, length: 1 }).then(async (res) => {
      if (res.data.length && res.data.length < res.recordsTotal) {
         res = await getListStandarHargaSipd({ ...params, kelompok, length: res.recordsTotal })
      }
      const data_with_id_akun = await getStandarHargaSipdFromExport({ ...params }).then((d) =>
         d.map((item) => {
            const id_akun = item.id_akun?.match(/\d+/g)?.map(Number)
            return { id_standar_harga: item.id_standar_harga, id_akun }
         })
      )
      return res.data.map((d) => {
         const id_akun =
            data_with_id_akun.find((i) => d.id_standar_harga === i.id_standar_harga)?.id_akun || []
         return { ...d, kelompok, is_sipd: true, id_akun }
      })
   })
}
export const getTotalStandarHargaSipd = async (
   params: Omit<Omit<ListStandarHargaSipdPayload, 'tipe'>, 'kelompok'>
) => {
   const partial = TIPES.map(async (tipe) => {
      const kelompok: ListStandarHargaSipdPayload['kelompok'] = tipeToKelompok(tipe)
      return await getListStandarHargaSipd({ ...params, kelompok, tipe, length: 1 }).then((d) => ({
         tipe,
         kelompok,
         recordsTotal: d.recordsTotal,
      }))
   })
   return await Promise.all(partial)
}

export const getStandarHargaSipdByTipe = async (params: ListStandarHargaByTipeAkunSipdPayload) => {
   return await postToSipd('listStandarHargaByTipeAkun', {
      keys: ['id_daerah', 'tipe', 'tahun', 'id_akun'],
      params: { ...params },
   }).then((res) => res.data)
}

export const getAkunStandarHargaSipd = async (params: ListAkunStandarHargaSipdPayload) => {
   return await postToSipd('listAkunStandarHarga', {
      keys: ['id_standar_harga', 'kelompok', 'kode_standar_harga', 'tahun', 'id_daerah'],
      params: { ...params },
   }).then((res) => res.data)
}

export const mappingAkunStandarHarga = async (
   p: ListAkunStandarHargaSipdPayload & { id: string }
) => {
   return await getAkunStandarHargaSipd(p).then(async (res) => {
      if (typeof res === 'object') {
         const id_akun = res?.map((d) => d.id_akun) || []
         return await axios.patch(`/api/perencanaan/data/standar-harga/${p.id}`, { id_akun })
      }
      return 'Tidak ada data akun'
   })
}

export const getStandarHargaById = async (
   id: string,
   params?: { with_akun?: string | number | boolean }
) => {
   return await axios
      .get<ResponseApi<StandarHargaById>>(`/api/perencanaan/data/standar-harga/${id}`, { params })
      .then((res) => res.data)
}

export async function getListStandarHarga(params: GetListStandarHargaParams) {
   return axios
      .get<
         ResponseApi<CursorPaginate<StandarHarga>>
      >(`/api/perencanaan/data/standar-harga`, { params })
      .then((res) => res?.data)
}

export async function getTolalStandarHarga<T extends StandarHargaQuery>(params?: T) {
   return axios
      .get<
         ResponseApi<{ totalCount: number; query: T }>
      >(`/api/perencanaan/data/standar-harga/total`, { params })
      .then((res) => res?.data)
}

export const getAllStandarHargaByAkunFromSipd = async (
   params: Omit<ListStandarHargaByTipeAkunSipdPayload, 'tipe'>
) => {
   return await Promise.all([
      getStandarHargaSipdByTipe({ ...params, tipe: 'SSH' }).then((res) =>
         res.map((d) => ({ ...d, kelompok: 1, is_sipd: true }))
      ),
      getStandarHargaSipdByTipe({ ...params, tipe: 'SSH' }).then((res) =>
         res.map((d) => ({ ...d, kelompok: 2, is_sipd: true }))
      ),
      getStandarHargaSipdByTipe({ ...params, tipe: 'SSH' }).then((res) =>
         res.map((d) => ({ ...d, kelompok: 3, is_sipd: true }))
      ),
      getStandarHargaSipdByTipe({ ...params, tipe: 'SSH' }).then((res) =>
         res.map((d) => ({ ...d, kelompok: 4, is_sipd: true }))
      ),
   ]).then((d) => d.flat())
}

// APi
export async function syncStandarHaga(data: StandarHargaUncheckedCreateInput[]) {
   return await axios.put('/api/perencanaan/data/standar-harga', data)
}

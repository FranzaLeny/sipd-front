import { postToSipd } from '@custom-axios/sipd-fetcher'

export const getJadwaRkpdAktifFromSipd = async (
   params: JadwalAnggranCekAktifSipdPayload & { is_anggaran?: 0 }
) => {
   return await postToSipd('jadwalRenjaAktif', {
      keys: ['id_daerah', 'tahun', 'is_anggaran'],
      params,
   }).then((res) => res.data)
}
export const getJadwaRkpdFromSipd = async (params: ListJadwalAnggranSipdPayload) => {
   return await postToSipd('listJadwalRenja', {
      keys: ['id_daerah', 'tahun'],
      params,
   }).then((res) => res.data)
}
export const validateRkpdSipd = async (params: {
   id_daerah: number
   id_unit: number
   id_user: number
   tahun: number
}) => {
   return await postToSipd('validateAllRenja', {
      keys: ['id_daerah', 'id_unit', 'id_user', 'tahun'],
      params,
   }).then((res) => res)
}

import { postToSipd } from '@custom-axios/sipd-fetcher'

export const getListUnitPemibiayaanSipd = async (payload: ListUnitPembiayaanSipdPayload) => {
   return await postToSipd('listUnitPembiayaan', {
      keys: ['id_daerah', 'tahun', 'id_unit', 'model', 'tipe_pembiayaan'],
      params: payload,
   }).then((res) => res.data)
}

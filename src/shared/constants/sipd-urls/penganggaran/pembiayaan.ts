import type { TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   listUnitPembiayaan: {
      payload: ListUnitPembiayaanSipdPayload
      response: ListUnitPembiayaanSipdResponse
   }
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   listUnitPembiayaan: {
      url: '/api/renja/pembiayaan/list_unit',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         id_unit: ID_UNIT,
         tipe_pembiayaan: 'pengeluaran',
         model: 'skpd',
      },
   },
}

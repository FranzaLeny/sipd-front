import type { TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   listPendapatan: {
      payload: ListPendapatanSkpdSipdPayload
      response: ListPendapatanSkpdSipdResponse
   }
   listPendapatanByUnit: {
      payload: ListPendapatanByUnitSipdPayload
      response: ListPendapatanByUnitSipdResponse
   }
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   listPendapatan: {
      url: '/api/renja/pendapatan/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
         model: 'skpd',
         length: 100000,
         start: 0,
         tahun: TAHUN,
         'order[0][column]': 0,
         'order[0][dir]': '',
      },
   },
   listPendapatanByUnit: {
      url: '/api/renja/pendapatan/listByIdUnit',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         id_unit: ID_UNIT,
      },
   },
}

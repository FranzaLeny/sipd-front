import { TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   listBlGiatSkpd: {
      payload: ListBySkpdPayload
      response: BlGiatDaerahSipdResponse
   }
   blGiat: {
      payload: BlGiatSipdPayload
      response: BlGiatSipdResponse
   }
   listCapaianBlGiatByGiat: {
      payload: ListCapaianBlGiatByGiatSipdPayload
      response: ListCapaianBlGiatByGiatSipdResponse
   }
   listCapaianBlGiatDaerah: {
      payload: ListBySkpdPayload
      response: ListCapaianBlGiatByGiatSipdResponse
   }
   listOutputBlGiatByGiat: {
      payload: ListOutputBlGiatByGiatSipdPayload
      response: ListOutputBlGiatByGiatSipdResponse
   }
   listOutputBlGiatDaerah: {
      payload: ListBySkpdPayload
      response: ListOutputBlGiatByGiatSipdResponse
   }
   listHasilBlGiatByGiat: {
      payload: ListHasilBlGiatByGiatSipdPayload
      response: ListHasilBlGiatByGiatSipdResponse
   }
   listHasilBlGiatDaerah: {
      payload: ListBySkpdPayload
      response: ListHasilBlGiatByGiatSipdResponse
   }
   listLabelBlGiatDaerah: {
      payload: ListLabelBlGiatDaerahSipdPayload
      response: ListLabelBlGiatDaerahSipdResponse
   }
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   blGiat: {
      url: '/api/renja/bl/load_data',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listBlGiatSkpd: {
      url: '/api/renja/bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_unit: ID_UNIT,
      },
   },
   listCapaianBlGiatByGiat: {
      url: '/api/renja/capaian_bl/load_data',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listCapaianBlGiatDaerah: {
      url: '/api/renja/capaian_bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_unit: ID_UNIT,
      },
   },
   listOutputBlGiatByGiat: {
      url: '/api/renja/output_giat/load_data',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listOutputBlGiatDaerah: {
      url: '/api/renja/output_giat/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_unit: ID_UNIT,
      },
   },
   listHasilBlGiatByGiat: {
      url: '/api/renja/hasil_bl/load_data',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listHasilBlGiatDaerah: {
      url: '/api/renja/hasil_bl/listAll',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_unit: ID_UNIT,
      },
   },
   listLabelBlGiatDaerah: {
      url: '/api/master/label_prov/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         start: 0,
         length: 1000,
         tahun: TAHUN,
      },
   },
}

import type { TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   listBlSubGiatBySubSkpd: {
      payload: ListBlSubGiatBySubSkpdSipdPayload
      response: BlSubGiatSipdResponse
   }
   listBlSubGiatAktif: {
      payload: ListBlSubGiatAktifSipdPayload
      response: ListBlSubGiatAktifSipdResponse
   }
   blSubGiat: {
      payload: BlSubGiatSipdPayload
      response: BlSubGiatSipdResponse
   }
   blSubGiatBySkpd: {
      payload: BlSubGiatBySkpdSipdPayload
      response: BlSubGiatBySkpdSipdResponse
   }
   listDanaBlSubGiat: {
      payload: ListDanaBlSubGiatSipdPayload
      response: ListDanaBlSubGiatSipdResponse
   }
   listLabelBlSubGiat: {
      payload: ListLabelBlSubGiatSipdPayload
      response: ListLabelBlSubGiatSipdResponse
   }
   listLokasiBlSubGiat: {
      payload: ListLokasiBlSubGiatSipdPayload
      response: ListLokasiBlSubGiatSipdResponse
   }
   listOutputBlSubGiat: {
      payload: ListOutputBlSubGiatSipdPayload
      response: ListOutputBlSubGiatSipdResponsed
   }
   listTagBlSubGiat: {
      payload: ListTagBlSubGiatSipdPayload
      response: ListTagBlSubGiatSipdResponse
   }
   // Rincian
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   listBlSubGiatBySubSkpd: {
      url: '/api/renja/sub_bl/list_by_sub_skpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
         id_sub_skpd: ID_UNIT,
      },
   },
   listBlSubGiatAktif: {
      url: '/api/renja/sub_bl/list_belanja_by_tahun_daerah_unit',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         id_unit: ID_UNIT,
         is_prop: 0,
      },
   },

   blSubGiat: {
      url: '/api/renja/sub_bl/view',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
      urlParam: ['id_sub_bl'],
   },
   blSubGiatBySkpd: {
      url: '/api/renja/sub_bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         id_unit: ID_UNIT,
         id_skpd: ID_UNIT,
      },
   },
   listDanaBlSubGiat: {
      url: '/api/renja/dana_sub_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listLabelBlSubGiat: {
      url: '/api/renja/label_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listLokasiBlSubGiat: {
      url: '/api/renja/detil_lokasi_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listOutputBlSubGiat: {
      url: '/api/renja/output_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listTagBlSubGiat: {
      url: '/api/renja/tag_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
}

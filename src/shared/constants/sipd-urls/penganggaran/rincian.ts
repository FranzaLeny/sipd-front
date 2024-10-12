import { TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   // Rincian
   listRinciBlSubGiat: {
      payload: ListRinciBlSubGiatSipdPayload
      response: ListRinciBlSubGiatSipdResponse
   }
   listRinciBlSubGiatBySkpd: {
      payload: ListRinciBlSubGiatBySkpdSipdPayload
      response: ListRinciBlSubGiatBySkpdSipdResponse
   }
   listRinciBlSubGiatBySbl: {
      payload: ListRinciBlSubGiatBySubBlSipdPayload
      response: ListRinciBlSubGiatBySubBlSipdResponse
   }
   listSubsRinciBlSubGiat: {
      payload: ListSubsRinciBlSubGiatSipdPayload
      response: ListSubsRinciBlSubGiatSipdResponse
   }
   viewRinciBlSubGiat: {
      payload: RinciBlSubGiatSipdPayload
      response: RinciBlSubGiatSipdResponse
   }
   deleteRinciBlSubGiat: {
      payload: DeleteRinciBlSubGiatSipdPayload
      response: DeleteRinciBlSubGiatSipdResponse
   }
   // Subs Rinci Sub Bl
   listSubsRinciBlSubGiatByIdSbl: {
      payload: ListSubsRinciBlSubGiatByIdSblSipdPayload
      response: ListSubsRinciBlSubGiatByIdSblSipdResponse
   }
   subsRinciBlSubGiat: {
      payload: SubsRinciBlSubGiatSipdPayload
      response: SubsRinciBlSubGiatSipdResponse
   }
   listSubsRinciBlSubGiatByIdList: {
      payload: ListSubsRinciBlSubGiatByIdListSipdPayload
      response: ListSubsRinciBlSubGiatByIdListSipdResponse
   }
   // Ket Rinci Sub Bl
   listKetRinciBlSubGiatBySbl: {
      payload: ListKetRinciBlSubGiatBySblSipdPayload
      response: ListKetRinciBlSubGiatBySblSipdResponse
   }
   listKetRinciBlSubGiatByDaerah: {
      payload: ListKetRinciBlSubGiatByDaerahSipdPayload
      response: ListKetRinciBlSubGiatByDaerahSipdResponse
   }
   listKetRinciBlSubGiatByIdList: {
      payload: ListKetRinciBlSubGiatByIdListSipdPayload
      response: ListKetRinciBlSubGiatByIdListSipdResponse
   }
   addKetRinciBlSubGiat: {
      payload: AddKetRinciBlSubGiatSipdPayload
      response: AddKetRinciBlSubGiatSipdResponse
   }
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   listRinciBlSubGiatBySkpd: {
      url: '/api/renja/rinci_sub_bl/list_by_id_skpd',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         id_skpd: ID_UNIT,
      },
   },
   listRinciBlSubGiat: {
      url: '/api/renja/rinci_sub_bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listRinciBlSubGiatBySbl: {
      url: '/api/renja/rinci_sub_bl/get_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   viewRinciBlSubGiat: {
      url: '/api/renja/rinci_sub_bl/view',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
      urlParam: ['id_rinci_sub_bl'],
   },
   deleteRinciBlSubGiat: {
      url: '/api/renja/rinci_sub_bl/hapus_rincian',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         aktivitas: 'delete',
         kunci_bl_rinci: 3,
      },
   },
   // Subs Rinci Sub Bl
   listSubsRinciBlSubGiatByIdSbl: {
      url: '/api/renja/subs_sub_bl/find_by_id_sub_bl',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         is_paket: 2,
      },
   },
   listSubsRinciBlSubGiat: {
      url: '/api/renja/subs_sub_bl/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listSubsRinciBlSubGiatByIdList: {
      url: '/api/renja/subs_sub_bl/find_by_id_list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   subsRinciBlSubGiat: {
      url: '/api/renja/subs_sub_bl/view',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
      urlParam: ['id_subs_sub_bl'],
   },
   // Ket Rinci Sub Bl
   listKetRinciBlSubGiatBySbl: {
      url: '/api/renja/ket_sub_bl/find',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
         id_sub_giat: 18497,
         kondisi_rincian: true,
         length: 100000,
      },
   },
   listKetRinciBlSubGiatByDaerah: {
      url: '/api/renja/ket_sub_bl/list',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
      },
   },
   listKetRinciBlSubGiatByIdList: {
      url: '/api/renja/ket_sub_bl/find_by_id_list',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   addKetRinciBlSubGiat: {
      url: '/api/renja/ket_sub_bl/add',
      defaultPayload: {
         id_daerah: ID_DAERAH,
      },
   },
}

import { TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   // LAPORAN RKA
   laporanRkaSkpd: {
      payload: LaporanRkaSkpdSipdPayload
      response: LaporanRkaSkpdSipdResponse
   }
   laporanRkaPendapatan: {
      payload: LaporanRkaPendapatanSipdPayload
      response: LaporanRkaPendapatanSipdResponse
   }
   laporanRkaRekapBelanja: {
      payload: LaporanRkaRekapBlSipdPayload
      response: LaporanRkaRekapBlSipdResponse
   }
   laporanRkaSubGiat: {
      payload: LaporanRkaSubGiatSipdPayolad
      response: LaporanRkaSubGiatSipdResponse
   }
   laporanRkaListRinciBlSubGiat: {
      payload: LaporanRkaListRinciBlSubGiatSipdPayload
      response: LaporanRkaListRinciBlSubGiatSipdResponse
   }

   // Laporan Perubahan
   laporanRkaPerubahanSkpd: {
      payload: LaporanRkaPerubahanSkpdSipdPayload
      response: LaporanRkaPerubahanSkpdSipdResponse
   }
   laporanRkaPerubahanPendapatan: {
      payload: LaporanRkaPerubahanPendapatanSipdPayload
      response: LaporanRkaPerubahanPendapatanSipdResponse
   }
   laporanRkaPerubahanRekapBl: {
      payload: LaporanRkaPerubahanRekapBlSipdPayload
      response: LaporanRkaPerubahanRekapBlSipdResponse
   }
   laporanRkaPerubahanSubGiat: {
      payload: LaporanRkaPerubahanSubGiatSipdPayload
      response: LaporanRkaPerubahanSubGiatSipdResponse
   }
   laporanRkaPerubahanListRinciBlSubGiat: {
      payload: LaporanRkaPerubahanListRinciBlSubGiatSipdPayload
      response: LaporanRkaPerubahanListRinciBlSubGiatSipdResponse
   }
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   laporanRkaSkpd: {
      url: '/api/renja/laporan/rkaBelanjaSkpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   laporanRkaPendapatan: {
      url: '/api/renja/laporan/rkaPendapatanSkpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   laporanRkaRekapBelanja: {
      url: '/api/renja/laporan/rkaRekapitulasiBelanjaSkpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   laporanRkaSubGiat: {
      url: '/api/renja/renja_laporan/listDataLampiranRKA',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         is_prop: 0,
         id_sub_giat: 18508,
      },
   },
   laporanRkaListRinciBlSubGiat: {
      url: '/api/renja/renja_laporan/listDataRincianBelanjaSubKegiatan',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
         id_sub_skpd: ID_UNIT,
      },
   },

   // Laporan Perubahan RKA
   laporanRkaPerubahanSkpd: {
      url: '/api/renja/laporan/rkaBelanjaSkpdPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   laporanRkaPerubahanPendapatan: {
      url: '/api/renja/laporan/rkaPendapatanSkpdPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   laporanRkaPerubahanRekapBl: {
      url: '/api/renja/laporan/rkaRekapitulasiBelanjaSkpdPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_skpd: ID_UNIT,
      },
   },
   laporanRkaPerubahanSubGiat: {
      url: '/api/renja/renja_laporan/listDataLampiranRKAPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
   laporanRkaPerubahanListRinciBlSubGiat: {
      url: '/api/renja/renja_laporan/listDataRincianBelanjaSubKegiatanPergeseran',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
      },
   },
}

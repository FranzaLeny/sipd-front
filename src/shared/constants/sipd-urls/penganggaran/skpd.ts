import { TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   //Penganggaran
   listSetupUnit: {
      payload: ListSetupUnitSipdPayload
      response: ListSetupUnitSipdResponse
   }
   listJadwalAnggaran: {
      payload: ListJadwalAnggranSipdPayload
      response: ListJadwalAnggranSipdResponse
   }
   jadwalAnggaranAktif: {
      payload: JadwalAnggranCekAktifSipdPayload
      response: JadwalAnggranCekAktifSipdResponse
   }
   listBelanjaSkpd: {
      payload: ListBelanjaSkpdSipdPayload
      response: ListBelanjaSkpdSipdResponse
   }
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   // RKA
   // Penganggaran
   listSetupUnit: {
      url: '/api/renja/setup_unit/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   listJadwalAnggaran: {
      url: '/api/jadwal/anggaran_jadwal/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   jadwalAnggaranAktif: {
      url: '/api/jadwal/anggaran_jadwal/cek_aktif',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         is_anggaran: 1,
      },
   },
   listBelanjaSkpd: {
      url: '/api/renja/sub_bl/list_skpd',
      defaultPayload: {
         tahun: TAHUN,
         id_daerah: ID_DAERAH,
         id_unit: ID_UNIT,
         id_level: 5,
         search: '',
         limit: 1000,
         offset: 0,
      },
   },
}

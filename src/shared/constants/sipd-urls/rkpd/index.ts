import type { TypePostSipdUrls } from '../types'

const ID_DAERAH = Number(process.env.NEXT_PUBLIC_SIPD_ID_DAERAH || 0)
const ID_UNIT = Number(process.env.NEXT_PUBLIC_SIPD_ID_UNIT || 0)
const TAHUN = Number(process.env.NEXT_PUBLIC_SIPD_TAHUN || 0)

export type TypesPost = {
   // RENJA
   listJadwalRenja: {
      payload: ListJadwalAnggranSipdPayload
      response: ListJadwalAnggranSipdResponse
   }
   validateAllRenja: {
      payload: { id_daerah: number; id_unit: number; id_user: number; tahun: number }
      response: unknown
   }
   jadwalRenjaAktif: {
      payload: JadwalAnggranCekAktifSipdPayload & { is_anggaran?: 0 }
      response: JadwalAnggranCekAktifSipdResponse
   }
   listDataLampiranLaporan: {
      payload: ListDataLampiranLaporanSipdPayload
      response: ListDataLampiranLaporanSipdResponse
   }
}

export const postUrls: TypePostSipdUrls<TypesPost> = {
   //RENJA
   listJadwalRenja: {
      url: '/api/jadwal/renja_jadwal/list',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
   validateAllRenja: {
      url: '/api/renja/sub_bl/validasi_semua_pagu',
      defaultPayload: {
         id_daerah: 424,
         id_unit: 1871,
         id_user: 36663,
      },
   },

   jadwalRenjaAktif: {
      url: '/api/jadwal/renja_jadwal/cek_aktif',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
         is_anggaran: 0,
      },
   },
   // Laporan
   listDataLampiranLaporan: {
      url: '/api/renja/renja_laporan/listDataLampiranLaporan',
      defaultPayload: {
         id_daerah: ID_DAERAH,
         tahun: TAHUN,
      },
   },
}

// interface IsAnggaran {
//   is_anggaran: number
//   id_jadwal: number
// }
// interface NotAnggaran {
//   is_anggaran?: undefined
//   id_jadwal?: undefined
// }

interface JadwalAnggranCekAktifSipdPayload {
   id_daerah: number
   tahun: number
   is_anggaran: number
}

interface JadwalAnggranCekAktifSipdResponse {
   status: boolean
   status_code: number
   data: JadwalAnggranSipd[]
}

interface ListJadwalAnggranSipdPayload {
   id_daerah: number
   tahun: number
}
interface ListJadwalAnggranSipdResponse {
   status: boolean
   status_code: number
   data: JadwalAnggranSipd[]
}

interface JadwalAnggranSipd {
   id_jadwal: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_tahap: number
   nama_sub_tahap: string
   waktu_mulai: string
   waktu_selesai: string
   is_perubahan: number
   id_jadwal_murni: number
   is_pembahasan: number
   id_jadwal_pembahasan: number
   is_locked: number
   is_public: number
   created_user?: number
   created_at?: string
   updated_user?: number
   updated_at?: string
   is_rinci_bl: number
   id_sub_rkpd: number
   no_registrasi: string
   no_perda: string
   tgl_perda?: any
   no_perkada: string
   tgl_perkada?: any
   tgl_rka?: any
   tandai_jadwal: number
   id_jadwal_rpjmd: number
   rkpd_murni: number
   rkpd_pak: number
   nama_daerah?: any
   nama_tahap?: any
   nama_jadwal_murni?: any
   nama_jadwal_pembahasan?: any
   nama_sub_rkpd?: any
   nama_jadwal_rpjmd?: any
   kua_murni?: any
   kua_pak?: any
   rollback_text?: any
   rollback_jadwal?: any
   rollback_teks?: any
   geser_khusus: number
}

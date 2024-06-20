interface ListBlSubGiatAktifSipdPayload {
   tahun: number
   id_daerah: number
   id_unit: number
   is_prop: number
   is_anggaran?: number
   id_jadwal?: number | null
}
interface ListBlSubGiatAktifSipdResponse {
   status: boolean
   status_code: number
   data: string
}
// interface BlSubGiatAktifSipd {
//   created_date: string
//   created_time: string
//   created_user: number
//   id_bidang_urusan: number
//   id_daerah: number
//   id_giat: number
//   id_program: number
//   id_skpd: number
//   id_sub_bl: number
//   id_sub_giat: number
//   id_sub_skpd: number
//   id_unit: number
//   id_urusan: number
//   is_locked: number
//   kode_bidang_urusan: string
//   kode_bl: string
//   kode_giat: string
//   kode_program: string
//   kode_sbl: string
//   kode_skpd: string
//   kode_sub_giat: string
//   kode_sub_skpd: string
//   kode_urusan: string
//   kunci_bl_rinci: number
//   kunci_bl: number
//   nama_bidang_urusan: string
//   nama_giat: string
//   nama_program: string
//   nama_skpd: string
//   nama_sub_giat: string
//   nama_sub_skpd: string
//   nama_urusan: string
//   pagu_giat: number
//   pagu_indikatif: number
//   pagu: number
//   rinci_giat?: number
//   rincian?: number
//   set_pagu_at: string
//   set_pagu_user: number
//   tahun: number
//   updated_date?: string
//   updated_time?: string
//   user_created: string
//   user_updated?: string
// }

interface BlSubGiatAktifSipd {
   created_date: string
   created_time: string
   created_user: number
   id_bidang_urusan: number
   id_daerah: number
   id_giat: number
   id_program: number
   id_skpd: number
   id_sub_bl: number
   id_sub_giat: number
   id_sub_skpd: number
   id_unit: number
   id_urusan: number
   is_locked: number
   kode_bidang_urusan: string
   kode_bl: string
   kode_giat: string
   kode_program: string
   kode_sbl: string
   kode_skpd: string
   kode_sub_giat: string
   kode_sub_skpd: string
   kode_urusan: string
   kunci_bl_rinci: number
   kunci_bl: number
   nama_bidang_urusan: string
   nama_giat: string
   nama_program: string
   nama_skpd: string
   nama_sub_giat: string
   nama_sub_skpd: string
   nama_urusan: string
   pagu_giat: number
   pagu_indikatif: number
   pagu_murni: number
   pagu: number
   rinci_giat: null | number
   rincian: null | number
   set_pagu_at: null | string
   set_pagu_user: number
   tahun: number
   updated_date: null | string
   updated_time: null | string
   user_created: string
   user_updated: null | string
}

interface ListLokasiBlSubGiatSipdPayload {
   id_daerah: number
   tahun: number
   id_sub_bl: number
   id_jadwal?: number
}
interface ListLokasiBlSubGiatSipdResponse {
   status: boolean
   status_code: number
   data: LokasiBlSubGiatSipd[]
}

interface LokasiBlSubGiatSipd {
   id_detil_lokasi: number
   tahun: number
   id_daerah: number
   id_unit: number
   id_bl: number
   id_sub_bl: number
   id_kab_kota: number
   id_camat: number
   id_lurah: number
   created_user: number
   created_at: string
   updated_user: number
   updated_at: string
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   id_sub_giat: number
   nama_daerah: string
   nama_unit: string
   nama_bl?: any
   nama_sub_bl?: any
   nama_kab_kota: string
   nama_camat: string
   nama_lurah: string
   nama_skpd?: any
   nama_sub_skpd?: any
   nama_program?: any
   nama_giat?: any
   nama_sub_giat?: any
   kode_daerah?: any
   kode_kab_kota?: any
   kode_camat?: any
   kode_lurah?: any
   kode_skpd?: any
   kode_sub_skpd?: any
   kode_program?: any
   kode_giat?: any
   kode_sub_giat?: any
   id_jadwal?: any
}

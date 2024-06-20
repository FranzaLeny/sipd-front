interface ListDanaBlSubGiatSipdPayload {
   id_daerah: number
   tahun: number
   id_sub_bl: number
   id_jadwal?: number
}
interface ListDanaBlSubGiatSipdResponse {
   status: boolean
   status_code: number
   data: DanaBlSubGiatSipd[]
}

interface DanaBlSubGiatSipd {
   id_dana_sub_bl: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   id_bl: number
   id_sub_bl: number
   id_dana: string
   created_user: number
   created_at: string
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   id_sub_giat: number
   pagu_dana: number
   nama_daerah?: any
   nama_unit?: any
   nama_bl?: any
   nama_sub_bl?: any
   nama_dana: string
   nama_skpd?: any
   nama_sub_skpd?: any
   nama_program?: any
   nama_giat?: any
   nama_sub_giat?: any
   kode_dana: string
   kode_unit?: any
   kode_sub_skpd?: any
   kode_program?: any
   kode_giat?: any
   kode_sub_giat?: any
   id_jadwal?: any
   is_locked: string
}

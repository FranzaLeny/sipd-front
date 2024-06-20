interface ListOutputBlSubGiatSipdPayload {
   id_daerah: number
   tahun: number
   id_sub_bl: number
   id_jadwal?: number
}
interface ListOutputBlSubGiatSipdResponsed {
   status: boolean
   status_code: number
   data: OutputBlSubGiatSipd[]
}

interface OutputBlSubGiatSipd {
   id_output_bl: number
   id_bl: number
   tahun: number
   id_daerah: number
   id_unit: number
   tolak_ukur: string
   target: string
   satuan: string
   target_teks: string
   created_user: number
   created_at: string
   updated_user: number
   updated_at: string
   tolok_ukur_sub: string
   target_sub: number
   satuan_sub: string
   target_sub_teks: string
   id_sub_bl: number
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   id_sub_giat: number
   nama_bl?: any
   nama_daerah: string
   nama_unit: string
   nama_sub_bl?: any
   nama_skpd: string
   nama_sub_skpd: string
   nama_program: string
   nama_giat: string
   nama_sub_giat: string
   kode_daerah?: any
   kode_unit?: any
   kode_skpd?: any
   kode_sub_skpd?: any
   kode_program?: any
   kode_giat?: any
   kode_sub_giat?: any
   id_jadwal?: any
}

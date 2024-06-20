interface ListHasilBlGiatByGiatSipdPayload {
   tahun: number
   id_daerah: number
   id_program: number
   id_giat: number
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
}
interface ListHasilBlGiatByGiatSipdResponse {
   status: boolean
   status_code: number
   data: HasilBlGiatSipd[]
}
interface HasilBlGiatSipd {
   id_hasil_bl: number
   id_bl: number
   tahun: number
   id_daerah: number
   id_unit: number
   tolak_ukur: string
   target: number
   satuan: string
   target_teks: string
   created_user: number
   created_at: string
   updated_user: number
   updated_at: string
   tolok_ukur_sub: string
   target_sub?: any
   satuan_sub?: any
   target_sub_teks: string
   id_sub_bl: number
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   nama_bl?: any
   nama_daerah?: any
   nama_unit?: any
   nama_sub_bl?: any
   nama_skpd?: any
   nama_sub_skpd?: any
   nama_program?: any
   nama_giat?: any
   kode_daerah?: any
   kode_unit?: any
   kode_skpd?: any
   kode_sub_skpd?: any
   kode_program?: any
   kode_giat?: any
}

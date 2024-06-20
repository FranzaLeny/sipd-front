interface ListCapaianBlGiatByGiatSipdPayload {
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
}
interface ListCapaianBlGiatByGiatSipdResponse {
   status: boolean
   status_code: number
   data: CapaianBlGiatSipd[]
}
interface CapaianBlGiatSipd {
   id_capaian_bl: number
   id_bl: number
   tahun: number
   id_daerah: number
   id_unit: number
   tolak_ukur: string
   target: string
   satuan: string
   target_teks: string
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   kode_rpjm: string
   nama_daerah?: any
   nama_unit?: any
   nama_skpd?: any
   nama_sub_skpd?: any
   nama_program?: any
   nama_giat?: any
}

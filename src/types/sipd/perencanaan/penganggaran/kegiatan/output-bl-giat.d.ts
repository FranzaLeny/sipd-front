interface ListOutputBlGiatByGiatSipdPayload {
   tahun: number
   id_daerah: number
   id_program: number
   id_giat: number
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
}
interface ListOutputBlGiatByGiatSipdResponse {
   status: boolean
   status_code: number
   data: ListOutputBlGiatByGiatSipd[]
}

interface ListOutputBlGiatByGiatSipd {
   id_output_giat: number
   tahun: number
   id_daerah: number
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   kode_rpjm: string
   kode_renstra: string
   tolok_ukur: string
   target: string
   satuan: string
   target_teks: string
   nama_daerah?: string
   nama_unit?: string
   nama_skpd?: string
   nama_sub_skpd?: string
   nama_program?: string
   nama_giat?: string
}

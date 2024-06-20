interface ListTagBlSubGiatSipdPayload {
   id_daerah: number
   tahun: number
   id_sub_bl: number
   id_jadwal?: number
}
interface ListTagBlSubGiatSipdResponse {
   status: boolean
   status_code: number
   data: TagBlSubGiatSipd[]
}
interface TagBlSubGiatSipd {
   created_user: number
   id_bl: number
   id_daerah: number
   id_giat: number
   id_jadwal?: number | null
   id_label_giat: number
   id_program: number
   id_skpd: number
   id_sub_bl: number
   id_sub_giat: number
   id_sub_skpd: number
   id_tag_bl: number
   id_unit: number
   nama_label_giat: string
   tahun: number
   updated_user: number
   updated_at?: Date | string
   created_at?: Date | string
}

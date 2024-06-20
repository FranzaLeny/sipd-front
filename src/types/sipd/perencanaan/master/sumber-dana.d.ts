interface ListSumberDanaSipdPayload {
   tahun: number
   id_daerah: number
   length?: number
   start?: number
   deleted_data?: boolean
}
interface ListSumberDanaSipdResponse {
   status: boolean
   status_code: number
   data: ListSumberDanaSipd
}

interface ListSumberDanaSipd {
   recordsTotal: number
   recordsFiltered: number
   data: SumberDanaSipd[]
}

interface SumberDanaSipd {
   id_dana: number
   tahun: number
   id_daerah: number
   kode_dana: string
   nama_dana: string
   id_unik?: any
   is_locked: number
   set_input: number
   created_user: number
   created_at: string | Date
   created_ip?: any
   updated_user: number
   updated_at?: any
   updated_ip?: any
   level?: any
   status_aktif: boolean
   set_prov: number
   set_kab_kota: number
   nama_dana_lama?: any
   kunci_tahun?: any
   mulai_tahun?: any
   id_jns_dana?: any
   id_type_dana?: any
}

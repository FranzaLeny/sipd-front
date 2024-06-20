interface ListKetRinciBlSubGiatBySblSipdPayload {
   tahun: number
   id_daerah: number
   id_unit: number
   id_sub_giat: number
   kondisi_rincian: boolean
   length: number
}
interface ListKetRinciBlSubGiatBySblSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: KetRinciBlSubGiatSipd[]
}

interface KetRinciBlSubGiatSipd {
   id_ket_sub_bl: number
   id_bl: number
   id_sub_bl: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   ket_bl_teks: string
   created_user: number
   created_at: string
   updated_user: number
   updated_at?: any
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   id_sub_giat: number
   nama_bl?: any
   nama_sub_bl?: any
   nama_daerah: string
   nama_unit: string
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
interface ListKetRinciBlSubGiatByDaerahSipdPayload {
   tahun: number
   id_daerah: number
   id_unit: number
}
interface ListKetRinciBlSubGiatByDaerahSipdResponse {
   status_code: number
   status: boolean
   data: KetRinciBlSubGiatSipd[]
}

interface KetRinciBlSubGiatSipd {
   id_ket_sub_bl: number
   id_bl: number
   id_sub_bl: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   ket_bl_teks: string
   created_user: number
   created_at: string
   updated_user: number
   updated_at?: any
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   id_sub_giat: number
   nama_bl?: any
   nama_sub_bl?: any
   nama_daerah: string
   nama_unit: string
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

interface ListKetRinciBlSubGiatByIdListSipdPayload {
   tahun: number
   id_daerah: number
   __id_ket_sub_bl_list: number[]
   is_anggaran?: 1 | 0
}
interface ListKetRinciBlSubGiatByIdListSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: KetRinciBlSubGiatByIdList[]
}

interface KetRinciBlSubGiatByIdList {
   id_ket_sub_bl: number
   id_bl: number
   id_sub_bl: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   ket_bl_teks: string
   created_user: number
   created_at: string
   updated_user: number
   updated_at?: any
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   id_sub_giat: number
   nama_bl?: any
   nama_sub_bl?: any
   nama_daerah: string
   nama_unit: string
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

interface AddKetRinciBlSubGiatSipdPayload {
   ket_bl_teks: string
   id_bl: number
   id_sub_bl: number
   tahun: number
   id_daerah: number
   id_unit: number
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   id_sub_giat: number
   nama_daerah: string
   nama_unit: string
   nama_skpd: string
   nama_sub_skpd: string
   nama_program: string
   nama_giat: string
   nama_sub_giat: string
   id_daerah_log: number
   id_user_log: number
}

interface AddKetRinciBlSubGiatSipdResponse {
   status_code: number
   status: boolean
   message: string
}

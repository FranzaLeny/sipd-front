interface ListSubsRinciBlSubGiatSipdPayload {
   tahun: number
   id_daerah: number
}

interface ListSubsRinciBlSubGiatSipdResponse {
   status: boolean
   status_code: number
   data: SubsRinciBlSubGiatSipd[]
}

interface ListSubsRinciBlSubGiatByIdSblSipdPayload {
   tahun: number
   id_daerah: number
   id_subs_sub_bl: number
   is_paket: 0 | 1 | 2 | 3 //HACK belum nomor paket yang benar
}

interface ListSubsRinciBlSubGiatByIdSblSipdResponse {
   status: boolean
   status_code: number
   data: SubsRinciBlSubGiatByIdSblSipd[]
}

interface SubsRinciBlSubGiatByIdSblSipd {
   id_subs_sub_bl: number
   id_bl: number
   id_sub_bl: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   subs_bl_teks: string
   is_paket: number
   id_jenis_barjas: number
   id_metode_barjas: number
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
   nama_jenis_barjas: string
   nama_metode_barjas: string
   nama_skpd: string
   nama_sub_skpd: string
   nama_program: string
   nama_giat: string
   nama_sub_giat: string
   id_dana?: any
   kode_daerah?: any
   kode_unit?: any
   kode_skpd?: any
   kode_sub_skpd?: any
   kode_urusan?: any
   kode_bidang_urusan?: any
   kode_program?: any
   kode_giat?: any
   kode_sub_giat?: any
   nama_bidang_urusan?: any
   id_jadwal?: any
}

interface SubsRinciBlSubGiatSipdPayload {
   tahun: number
   id_daerah: number
   id_sub_bl: number
   id_subs_sub_bl: number
}

interface SubsRinciBlSubGiatSipdResponse {
   status: boolean
   status_code: number
   data: SubsRinciBlSubGiatSipd[]
}

interface SubsRinciBlSubGiatSipd {
   id_subs_sub_bl: number
   id_bl: number
   id_sub_bl: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   subs_bl_teks: string
   is_paket: number
   id_jenis_barjas: number
   id_metode_barjas: number
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
   nama_jenis_barjas: string
   nama_metode_barjas: string
   nama_skpd: string
   nama_sub_skpd: string
   nama_program: string
   nama_giat: string
   nama_sub_giat: string
   id_dana?: any
   kode_daerah?: any
   kode_unit?: any
   kode_skpd?: any
   kode_sub_skpd?: any
   kode_urusan?: any
   kode_bidang_urusan?: any
   kode_program?: any
   kode_giat?: any
   kode_sub_giat?: any
   nama_bidang_urusan?: any
   id_jadwal?: any
}

interface ListSubsRinciBlSubGiatByIdListSipdPayload {
   tahun: number
   id_daerah: number
   __id_subs_sub_bl_list: number[]
   is_anggaran?: 1 | 0
}
interface ListSubsRinciBlSubGiatByIdListSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: SubsRinciBlSubGiatFindById[]
}

interface SubsRinciBlSubGiatFindById {
   id_subs_sub_bl: number
   id_bl: number
   id_sub_bl: number
   id_unik: string
   tahun: number
   id_daerah: number
   id_unit: number
   subs_bl_teks: string
   is_paket: number
   id_jenis_barjas: number
   id_metode_barjas: number
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
   nama_jenis_barjas: string
   nama_metode_barjas: string
   nama_skpd: string
   nama_sub_skpd: string
   nama_program: string
   nama_giat: string
   nama_sub_giat: string
   id_dana?: any
   kode_daerah?: any
   kode_unit?: any
   kode_skpd?: any
   kode_sub_skpd?: any
   kode_urusan?: any
   kode_bidang_urusan?: any
   kode_program?: any
   kode_giat?: any
   kode_sub_giat?: any
   nama_bidang_urusan?: any
   id_jadwal?: any
}

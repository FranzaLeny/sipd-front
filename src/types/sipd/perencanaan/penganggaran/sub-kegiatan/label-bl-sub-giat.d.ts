//GET /api/master/label_kokab/view/678/2024/424
interface ViewLabelKabKotaSipdResponse {
   status: boolean
   status_code: number
   data: LabelKabKotaViewSipd[]
}

interface ViewLabelKabKotaSipd {
   id_label_kokab: number
   tahun: number
   id_daerah: number
   nama_label: string
   id_unik: string
   is_locked: number
   created_user: number
   created_at: string
   created_ip?: any
   updated_user: number
   updated_at: string
   updated_ip?: any
}
//GET /api/master/label_prov/view/70/2024/418
interface ViewLabelProvSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: ViewLabelProvSipd[]
}

interface ViewLabelProvSipd {
   id_label_prov: number
   tahun: number
   id_daerah: number
   nama_label: string
   id_unik: string
   is_locked: number
   created_user: number
   created_at: string
   created_ip?: any
   updated_user: number
   updated_at: string
   updated_ip?: any
}

interface ListLabelBlSubGiatSipdPayload {
   id_daerah: number
   tahun: number
   id_sub_bl: number
   id_jadwal?: number
}
interface ListLabelBlSubGiatSipdResponse {
   status: boolean
   status_code: number
   data: LabelBlSubGiatSipd[]
}

interface LabelBlSubGiatSipd {
   id_label_bl: number
   id_bl: number
   tahun: number
   id_daerah: number
   id_unit: number
   id_label_pusat: number
   id_label_prov: number
   id_label_kokab: number
   created_user: number
   created_at: string
   updated_user: number
   updated_at: string
   id_sub_bl: number
   id_skpd: number
   id_sub_skpd: number
   id_program: number
   id_giat: number
   id_sub_giat: number
   nama_bl?: any
   nama_daerah: string
   nama_unit: string
   nama_label_pusat: string
   nama_label_prov: string
   nama_label_kokab: string
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

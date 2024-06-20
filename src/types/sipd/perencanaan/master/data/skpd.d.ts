interface SkpdListSipdPayload {
   tahun: number
   id_daerah: number
   length?: number
   start?: number
   deleted_data?: boolean
}
interface SkpdListAllSipdPayload {
   tahun: number
   id_daerah: number
}
interface SkpdListAllSipdResponse {
   status_code: number
   status: boolean
   data: SkpdSipd[]
}
interface SkpdListSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: SkpdList
}

interface SkpdList {
   recordsTotal: number
   recordsFiltered: number
   data: SkpdSipd[]
}

interface SkpdSipd {
   created_at: any
   created_ip?: any
   created_user: number
   id_daerah: number
   id_kecamatan?: any
   id_skpd: number
   id_strategi: number
   id_unik: string
   id_unit: number
   is_dpa_khusus: number
   is_locked: number
   is_pendapatan: number
   is_ppkd: number
   is_skpd: number
   kode_skpd_lama?: any
   kode_skpd: string
   kode_unit: string
   komisi?: any
   nama_bendahara: string
   nama_kepala: string
   nama_skpd: string
   nip_bendahara: string
   nip_kepala: string
   pangkat_kepala: string
   set_input: number
   status_kepala: string
   tahun: number
   updated_at: any
   updated_ip?: any
   updated_user: number
}

// https://sipd-ri.kemendagri.go.id/api/master/skpd/view/1871/2024/424
interface SkpdViewSipdPayload {
   id_skpd: number
   tahun: number
   id_daerah: number
}

interface SkpdViewSipdResponse {
   status: boolean
   status_code: number
   data: SkpdView[]
}

interface SkpdView {
   created_at: string
   created_ip?: any
   created_user: number
   id_bidang_urusan_1: number
   id_bidang_urusan_2: number
   id_bidang_urusan_3: number
   id_daerah: number
   id_kecamatan?: any
   id_skpd: number
   id_strategi: number
   id_unik: string
   id_unit: number
   is_dpa_khusus: number
   is_locked: number
   is_pendapatan: number
   is_ppkd: number
   is_skpd: number
   kode_opd: string
   kode_skpd_lama?: any
   kode_skpd: string
   kode_unit: string
   komisi?: any
   nama_bendahara: string
   nama_kepala: string
   nama_skpd: string
   nip_bendahara: string
   nip_kepala: string
   pangkat_kepala: string
   set_input: number
   status_kepala: string
   tahun: number
   updated_at: string
   updated_ip?: any
   updated_user: number
}

interface ListSetupUnitSipdPayload {
   id_daerah: number
   tahun: number
}
interface ListSetupUnitSipdResponse {
   status: boolean
   status_code: number
   data: SetupUnitSipd[]
}
interface SetupUnitSipd {
   id_setup_unit: number
   tahun: number
   id_daerah: number
   id_unit: number
   pagu_indikatif: number
   set_pagu_user: number
   set_pagu_at?: string
   kunci_tambah_giat: number
   kuota_giat: number
   tambah_giat_user: number
   tambah_giat_at: string
   kuota_staf: number
   kuota_staf_user: number
   kuota_staf_at?: any
   kunci_skpd: number
   kunci_skpd_user: number
   kunci_skpd_at: string
   kunci_input_penda: number
   kunci_penda_user: number
   kunci_penda_at?: any
   kunci_input_biaya: number
   kunci_biaya_user: number
   kunci_biaya_at: string
   id_jadwal?: any
}

interface ListBelanjaSkpdSipdPayload {
   id_daerah: number
   tahun: number
   id_user: number
   id_unit: number
   id_level: number
   search?: string
   limit?: number
   offset?: number
   is_anggaran?: number
}
interface ListBelanjaSkpdSipdResponse {
   status_code: number
   status: boolean
   message: string
   totalData: TotalData
   data: string
   recordsTotal: number
   recordsFiltered: number
}

interface TotalData {
   pagu: number
   pagu_indikatif: number
   rinci: number
   batasan: number
}

interface BelanjaSkpdSipd {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_unit: number
   kode_skpd: string
   nama_skpd: string
   total_giat: number
   belanja_terbuka: number
   set_pagu_skpd: number
   set_pagu_giat: number
   pagu_murni: number
   rinci_giat: number
   rincian_terbuka: number
}

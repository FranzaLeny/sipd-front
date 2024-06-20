interface ListBidangUrusanSipdPayload {
   tahun: number
   id_daerah: number
   length?: number
   start?: number
}

interface ListBidangUrusanSipdResponse {
   status_code: number
   status: boolean
   message: string
   data: ListBidangUrusanSipd
}

interface ListBidangUrusanSipd {
   recordsTotal: number
   recordsFiltered: number
   data: BidangUrusanSipd[]
}

interface BidangUrusanSipd {
   id_bidang_urusan: number
   tahun: number
   id_daerah: number
   id_urusan: number
   id_fungsi: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_unik?: any
   is_locked: number
   created_user?: any
   created_at?: any
   created_ip?: any
   updated_user?: any
   updated_at?: any
   updated_ip?: any
   set_prov: number
   set_kab_kota: number
   id_daerah_khusus?: any
   bidang_urusan_alias: string
}

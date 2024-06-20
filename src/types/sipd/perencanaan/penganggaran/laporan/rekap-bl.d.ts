// https://sipd-ri.kemendagri.go.id/api/renja/laporan/rkaRekapitulasiBelanjaSkpd

type RkaBlSkpdSipdPayload = {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_sub_skpd?: number
   is_anggaran?: number
   id_jadwal?: number
}

interface RkaBlSkpdSipdResponse {
   status: boolean
   status_code: number
   data: ItemRkaSkpdSipd[]
}

interface ItemRkaSkpdSipd {
   id_sub_bl: number
   tahun: number
   id_daerah: number
   id_sub_skpd: number
   pagu_n_depan?: number | null
   kode_skpd: string
   nama_skpd: string
   kode_urusan: string
   nama_urusan: string
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   kode_program: string
   nama_program: string
   kode_giat: string
   nama_giat: string
   kode_sub_giat: string
   nama_sub_giat: string
   nama_dana: string
   lokasi_bl: string
   bo?: number | null
   bm?: number | null
   btt?: number | null
   bt?: number | null
   total?: number | null
   tipe: string
}

interface RkaBlPergeseranSkpdSipdPayload {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_sub_skpd: number
}
interface RkaBlPergeseranSkpdSipdResponse {
   status: boolean
   status_code: number
   data: DataRkaBlPergeseranSkpdSipd
}

interface DataRkaBlPergeseranSkpdSipd {
   data: RkaBlPergeseranSkpdSipd[]
   summary: SummaryRkaBlPergeseranSkpdSipd
}

interface SummaryRkaBlPergeseranSkpdSipd {
   sum_pagu_n_lalu: number
   sum_bo_murni: number
   sum_bm_murni: number
   sum_btt_murni: null | number
   sum_bt_murni: null | number
   sum_total_murni: number
   sum_bo: number
   sum_bm: number
   sum_btt: null | number
   sum_bt: null | number
   sum_total: number
   sum_pagu_n_depan: number
}

interface RkaBlPergeseranSkpdSipd {
   kode_sub_skpd: string
   nama_sub_skpd: string
   kode: string
   uraian: string
   sumber_dana: string
   lokasi: string
   pagu_n_lalu: number
   bo_murni: null | number
   bm_murni: null | number
   btt_murni: null | number
   bt_murni: null | number
   total_murni: null | number
   bo_geser: null | number
   bm_geser: null | number
   btt_geser: null | number
   bt_geser: null | number
   total_geser: null | number
   pagu_n_depan: null | number
}

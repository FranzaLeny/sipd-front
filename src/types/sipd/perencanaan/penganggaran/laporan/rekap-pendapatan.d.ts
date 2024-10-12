// https://sipd-ri.kemendagri.go.id/api/renja/laporan/rkaPendapatanSkpd
type LaporanRkaPendapatanSipdPayload = {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_jadwal?: number
}

interface LaporanRkaPendapatanSipdResponse {
   status: boolean
   status_code: number
   data: LaporanRkaPendapatanSipd
}

interface LaporanRkaPendapatanSipd {
   pendapatan: ItemRkaPendapatanSkpdSipd[]
   jumlah_pendapatan: number
   data_setup_tapd: any[]
}

interface ItemRkaPendapatanSkpdSipd {
   kode?: string | null
   uraian?: string | null
   volume?: string | null
   satuan?: string | null
   harga?: number | string | null
   jumlah?: number | string | null
}

interface LaporanRkaPerubahanPendapatanSipdPayload {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_sub_skpd: number
}
interface LaporanRkaPerubahanPendapatanSipdResponse {
   status: boolean
   status_code: number
   data: DataRkaPendapatanPergeseranSkpdSipd
}

interface DataRkaPendapatanPergeseranSkpdSipd {
   data: LaporanRkaPerubahanPendapatanSipd[]
   tapd: any[]
}

interface LaporanRkaPerubahanPendapatanSipd {
   kode_akun: string
   nama_akun: string
   nilai_sebelum: number
   nilai_sesudah: number
   selisih: number
   keterangan: string
   koefisien: string
   satuan: string
}

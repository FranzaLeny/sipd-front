// https://sipd-ri.kemendagri.go.id/api/renja/laporan/rkaPendapatanSkpd
type RkaPendapatanSkpdSipdPayload = {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_jadwal?: number
}

interface RkaPendapatanSkpdSipdResponse {
   status: boolean
   status_code: number
   data: RkaPendapatanSkpdSipd
}

interface RkaPendapatanSkpdSipd {
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

interface RkaPendapatanPergeseranSkpdSipdPayload {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_sub_skpd: number
}
interface RkaPendapatanPergeseranSkpdSipdResponse {
   status: boolean
   status_code: number
   data: DataRkaPendapatanPergeseranSkpdSipd
}

interface DataRkaPendapatanPergeseranSkpdSipd {
   data: RkaPendapatanPergeseranSkpdSipd[]
   tapd: any[]
}

interface RkaPendapatanPergeseranSkpdSipd {
   kode_akun: string
   nama_akun: string
   nilai_sebelum: number
   nilai_sesudah: number
   selisih: number
   keterangan: string
   koefisien: string
   satuan: string
}

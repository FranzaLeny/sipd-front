type LaporanRkaSkpdSipdPayload = {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_sub_skpd?: number
   is_anggaran?: number
   id_jadwal?: number
}

interface LaporanRkaSkpdSipdResponse {
   status: boolean
   status_code: number
   data: LaporanRkaSkpdSipd
}

interface LaporanRkaSkpdSipd {
   pendapatan: _Pendapatan[]
   jumlah_pendapatan: number
   rincian: _Pendapatan[]
   jumlah_belanja: number
   defisit: number
   pembiayaan: Pembiayaan
   netto: number
}

interface Pembiayaan {
   penerimaan: number
   pengeluaran: number
}

interface _Pendapatan {
   kode_1: string
   kode_2: string
   kode_3: string
   uraian: string
   jumlah: number | null
}

interface LaporanRkaPerubahanSkpdSipdPayload {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_sub_skpd: number
}
interface LaporanRkaPerubahanSkpdSipdResponse {
   status: boolean
   status_code: number
   data: LaporanRkaPerubahanSkpdSipd[]
}

interface LaporanRkaPerubahanSkpdSipd {
   kode_akun: string
   nama_akun: string
   nilai_sebelum: number
   nilai_sesudah: number
   selisih: number
   persentase: string
   jenis: string
}

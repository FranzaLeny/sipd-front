type RkaSkpdSipdPayload = {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_sub_skpd?: number
   is_anggaran?: number
   id_jadwal?: number
}

interface RkaSkpdSipdResponse {
   status: boolean
   status_code: number
   data: RkaSkpdSipd
}

interface RkaSkpdSipd {
   pendapatan: Pendapatan[]
   jumlah_pendapatan: number
   rincian: Pendapatan[]
   jumlah_belanja: number
   defisit: number
   pembiayaan: Pembiayaan
   netto: number
}

interface Pembiayaan {
   penerimaan: number
   pengeluaran: number
}

interface Pendapatan {
   kode_1: string
   kode_2: string
   kode_3: string
   uraian: string
   jumlah: number | null
}

interface RkaPergeseranSkpdSipdPayload {
   tahun: number
   id_daerah: number
   id_skpd: number
   id_sub_skpd: number
}
interface RkaPergeseranSkpdSipdResponse {
   status: boolean
   status_code: number
   data: RkaPergeseranSkpdSipd[]
}

interface RkaPergeseranSkpdSipd {
   kode_akun: string
   nama_akun: string
   nilai_sebelum: number
   nilai_sesudah: number
   selisih: number
   persentase: string
   jenis: string
}

import axios from '@custom-axios/peta-fetcher'

export interface StatistikBelanjaSkpdSipd {
   id_daerah: number
   tahun: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   anggaran: number
   realisasi_rencana: number
   realisasi_rill: number
}

export const getStatistikBlSkpdSipd = async () => {
   return await axios.get<StatistikBelanjaSkpdSipd[]>(
      `pengeluaran/strict/dashboard/statistik-belanja`
   )
}

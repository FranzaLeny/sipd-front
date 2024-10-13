import axios from '@custom-axios/peta-fetcher'

interface JadwalPergeseranDpa {
   tahapan: string
   jadwal_sipd_penatausahaan: string
   id_tahap_sipd: number
   is_locked: number
   id_jadwal: number
   id_jadwal_sipd: number
}

export const getJadwaPergeseranDpaFromSipd = async () => {
   console.log('getJadwaPergeseranDpaFromSipd')

   return await axios.get<JadwalPergeseranDpa[]>(
      'referensi/strict/laporan/dpa/dpa/jadwal-pergeseran'
   )
}

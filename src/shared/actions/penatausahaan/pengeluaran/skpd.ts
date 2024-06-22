import axios from '@custom-axios/peta-fetcher'

interface SkpdPeta {
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
}
export const getSkpdPenatausahaanFromSipd = async ({
   id_daerah,
   tahun,
}: {
   id_daerah: number
   tahun: number
}) => {
   return await axios.get<SkpdPeta[]>(`referensi/strict/skpd/list/${id_daerah}/${tahun}`)
}

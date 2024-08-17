import axios from '@custom-axios/peta-fetcher'

export const getSkpdPenatausahaanFromSipd = async ({
   id_daerah,
   tahun,
}: {
   id_daerah: number
   tahun: number
}) => {
   return await axios.get<SkpdPeta[]>(`referensi/strict/skpd/list/${id_daerah}/${tahun}`)
}

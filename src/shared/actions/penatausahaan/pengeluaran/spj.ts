import axios from '@custom-axios/peta-fetcher'

export const getSpjFungsionalSipdPeta = async ({
   id_pegawai = 0,
   bulan,
   type,
}: {
   type: string
   bulan: string
   id_pegawai?: number
}) => {
   return await axios.get<SpjFungsionalSipdPeta>(`pengeluaran/strict/lpj/adm-fungs/0`, {
      params: { id_pegawai, bulan, type },
   })
}

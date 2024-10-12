'use server'

import axios from '@custom-axios/peta-fetcher'

export const getStatistikBlSkpdSipd = async () => {
   return await axios.get<StatistikBelanjaSkpdSipdPeta[]>(
      `pengeluaran/strict/dashboard/statistik-belanja`
   )
}

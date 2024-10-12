import { getSkpdTapdAnggaranBySkpd } from '@actions/perencanaan/data/skpd'
import { getServerSession } from '@shared/server-actions/auth'

import DppaSkpd from './component'

export const metadata = {
   title: 'DPA Rincian Belanja',
}
export default async function Page() {
   const session = await getServerSession(['sipd_peta'])
   if (!session || !session?.user?.accountPeta) {
      return (
         <div className='content py-10 text-center'>
            Untuk akses menu penatausahaan, harus masuk menggunakan akun SIPD-Penatausaan
         </div>
      )
   }
   const {
      user: {
         tahun,
         id_unit,
         accountPeta: { id_daerah, id_skpd },
      },
   } = session
   const dataSkpd = await getSkpdTapdAnggaranBySkpd({ id_daerah, tahun, id_unit, id_skpd })

   const data = { tahun, id_skpd, id_daerah, id_unit, dataSkpd }
   return <DppaSkpd {...data} />
}

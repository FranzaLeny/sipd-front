import { getSkpdTapdAnggaranBySkpd } from '@actions/perencanaan/data/skpd'
import { getServerSession } from '@shared/server-actions/auth'

import DppaSkpd from './component'

export const metadata = {
   title: 'Ringkasan DPA SKPD',
}

export default async function Page() {
   const session = await getServerSession(['sipd_peta'])
   const token = session?.user?.tokens?.find((d) => d.name === 'sipd_peta')?.token
   if (!session || !session?.user?.accountPeta || !token) {
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

   const data = { tahun, id_skpd, id_daerah, token, id_unit, dataSkpd }
   return <DppaSkpd {...data} />
}

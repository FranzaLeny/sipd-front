import { getServerSession } from '@shared/server-actions/auth'

import DppaSkpd from './component'

export const metadata = {
   title: 'SPJ',
}

export default async function Page({ searchParams }: { searchParams?: { bulan?: string } }) {
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
         accountPeta: { id_daerah, id_skpd },
      },
   } = session
   //   const dataSkpd = await getSkpdTapdAnggaranBySkpd({ id_daerah, tahun, id_unit, id_skpd })
   const defaultBulan = new Date().getMonth() + 1
   const bulan = searchParams?.bulan || defaultBulan.toString()
   const data = { bulan, id_daerah, id_skpd, tahun }

   return <DppaSkpd {...data} />
}

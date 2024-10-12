import { getUserProfileFromSipd } from '@actions/penatausahaan/sipd/user'
import { getServerSession } from '@shared/server-actions/auth'

export default async function Page() {
   const session = await getServerSession(['sipd_peta'])
   const id_user = session?.user?.accountPeta?.id_user!
   const data = await getUserProfileFromSipd({ id_user })

   return (
      <div className='content'>
         <div>
            Selamat datang <span className='font-bold'>{data?.nama_user}</span> di halaman SIPD
            Penatausahaan
         </div>
      </div>
   )
}

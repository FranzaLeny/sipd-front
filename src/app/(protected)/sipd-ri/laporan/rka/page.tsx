import { getSkpdTapdAnggaranBySkpd } from '@actions/perencanaan/data/skpd'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import Template from './_componens/template'

const getUserSipd = (data: any) => {
   try {
      return validateSipdSession(data)
   } catch (error) {
      return null
   }
}

export default async function Page() {
   const session = await getServerSession(['sipd_ri'])
   const user = getUserSipd(session)
   if (!user) {
      return <ErrorPage code={403} />
   }
   const skpd = await getSkpdTapdAnggaranBySkpd({
      id_daerah: user.id_daerah,
      id_skpd: user.id_skpd,
      id_unit: user.id_unit,
      tahun: user.tahun,
   }).catch((error) => null)
   if (!skpd) {
      return <ErrorPage code={404} />
   }

   return (
      <div className='content z-10 pb-3'>
         <Template skpd={skpd} />
      </div>
   )
}

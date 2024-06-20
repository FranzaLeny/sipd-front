import Breadcrumb from '@components/ui/Breadcrumbs'
import { getServerSession } from '@shared/server-actions/auth'

import RinciBl from './rinci-bl'

export const metadata = {
   title: 'Laporan Rincian Belanja',
}

const PATHS = [
   { title: 'Perencanaan' },
   { title: 'RKA' },
   { title: 'Laporan' },
   { title: 'Rincian Belanja' },
]
export default async function Page({ searchParams: { id } }: { searchParams: { id: string } }) {
   const { user } = await getServerSession()
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <RinciBl
            daerah={user?.id_daerah ?? 0}
            unit={user?.id_unit ?? 0}
            id={id}
         />
      </>
   )
}

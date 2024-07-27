import Breadcrumb from '@components/ui/Breadcrumbs'
import { getServerSession } from '@shared/server-actions/auth'

import Rincian from './_components/rincian'

export const metadata = {
   title: 'Rincian Belanja',
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'RKA' }, { title: 'Rincian Belanja' }]
export default async function Page({ searchParams: { id } }: { searchParams: { id: string } }) {
   const { user } = await getServerSession()

   return (
      <>
         <Breadcrumb paths={PATHS} />
         <Rincian
            daerah={user?.id_daerah ?? 0}
            unit={user?.id_unit ?? 0}
            tahun={user?.tahun ?? 0}
            id={id}
         />
      </>
   )
}

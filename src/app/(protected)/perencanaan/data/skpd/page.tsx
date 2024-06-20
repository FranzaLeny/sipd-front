import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionSkpdTable, helperColumns } from './_components'

export const metadata = {
   title: 'SKPD',
}

export type Skpd = {
   id: string
   nama_bendahara: string
   nama_kepala: string
   nama_skpd: string
   nip_bendahara: string
   nip_kepala: string
   pangkat_kepala: string
   status_kepala: string
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'Data' }, { title: 'Skpd' }]

const Page = async () => {
   const { hasAccess, user } = await getServerSession([
      'super_admin',
      'admin',
      'perencanaan',
      'admin_perencanaan',
   ])
   if (!hasAccess) return <ErrorPage code={401} />
   const { id_daerah, tahun } = user

   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            data_key='data_skpd'
            searchParamsStatic={{ tahun, id_daerah }}
            endpoint='api/perencanaan/master/skpd'
            tableActions={<ActionSkpdTable roles={user?.roles} />}
         />
      </>
   )
}

export default Page

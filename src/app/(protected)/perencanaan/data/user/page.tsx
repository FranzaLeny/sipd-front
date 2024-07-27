import TableServerSide from '@components/table/table-serverside'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionUserSipdPerencanaanTable, helperColumns } from './_components'

export const metadata = {
   title: 'User Sipd-RI',
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'Data' }, { title: 'User SIPD-RI' }]

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
            searchParamsStatic={{ tahun, id_daerah }}
            helperColumns={helperColumns}
            data_key={['user_sipd_perencanaan']}
            endpoint='/api/perencanaan/data/user'
            tableActions={<ActionUserSipdPerencanaanTable />}
         />
      </>
   )
}

export default Page

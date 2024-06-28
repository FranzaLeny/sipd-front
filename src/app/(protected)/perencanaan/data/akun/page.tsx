import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionAkunTable, helperColumns } from './_components'

export const metadata = {
   title: 'Akun',
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'Data' }, { title: 'Akun' }]

const Page = async () => {
   const { hasAccess, user } = await getServerSession([
      'super_admin',
      'admin',
      'perencanaan',
      'admin_perencanaan',
   ])
   if (!hasAccess) return <ErrorPage code={401} />
   const { tahun } = user ?? { id_daerah: 0, tahun: 0 }
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            searchParamsStatic={{ tahun }}
            data_key='data_akun'
            endpoint='api/perencanaan/master/akun'
            tableActions={<ActionAkunTable roles={user?.roles} />}
         />
      </>
   )
}

export default Page

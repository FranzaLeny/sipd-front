import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionTahapanTable, helperColumns } from './_components'

export const metadata = {
   title: 'Tahapan',
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'Data' }, { title: 'Tahapan' }]

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
            data_key={['data_tahapan']}
            endpoint='/api/perencanaan/data/tahapan'
            tableActions={<ActionTahapanTable />}
         />
      </>
   )
}

export default Page

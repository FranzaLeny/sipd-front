import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionUserTable, helperColumns } from './_components'

export const metadata = {
   title: 'User',
}

const PATHS = [{ title: 'Data' }, { title: 'User' }]

const Page = async () => {
   const { hasAccess, user } = await getServerSession(['super_admin', 'admin'])
   if (!hasAccess) return <ErrorPage code={403} />
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true, isStriped: true }}
            helperColumns={helperColumns}
            data_key='user'
            endpoint='api/master/user'
            tableActions={<ActionUserTable />}
         />
      </>
   )
}

export default Page

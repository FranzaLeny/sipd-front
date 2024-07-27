import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'

import { ActionRoleTable, helperColumns } from './_components'

export const metadata = {
   title: 'Role',
}

const PATHS = [{ title: 'Data' }, { title: 'Role' }]

const Page = async () => {
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            data_key={['role_user']}
            endpoint='/api/master/role'
            tableActions={<ActionRoleTable />}
         />
      </>
   )
}

export default Page

import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'

import { ActionTapdAnggaranTable, helperColumns } from './_components'

export const metadata = {
   title: 'TAPD',
}

const PATHS = [{ title: 'RKA' }, { title: 'TAPD' }]

const Page = async () => {
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            data_key='tapd_anggaran'
            endpoint='api/master/tapd'
            tableActions={<ActionTapdAnggaranTable />}
         />
      </>
   )
}

export default Page

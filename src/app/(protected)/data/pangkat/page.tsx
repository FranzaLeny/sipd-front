import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'

import { ActionPangkatTable, helperColumns } from './_components'

export const metadata = {
   title: 'Pangkat',
}

const PATHS = [{ title: 'Data' }, { title: 'Pangkat' }]

const Page = async () => {
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            data_key={['data_pangkat']}
            endpoint='/api/master/pangkat'
            tableActions={<ActionPangkatTable />}
         />
      </>
   )
}

export default Page

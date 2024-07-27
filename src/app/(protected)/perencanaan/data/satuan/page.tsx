import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'

import { ActionSatuanTable, helperColumns } from './_components'

export const metadata = {
   title: 'Satuan',
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'Data' }, { title: 'Satuan' }]

const Page = async () => {
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            data_key={['data_satuan']}
            endpoint='/api/perencanaan/data/satuan'
            tableActions={<ActionSatuanTable />}
         />
      </>
   )
}

export default Page

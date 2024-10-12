import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'

import { ActionPDinasTable, helperColumns } from './_components'

export const metadata = {
   title: 'Perjalanan Dinas',
}

const PATHS = [{ title: 'Kepegawaian' }, { title: 'Perjalanan Dinas' }]

const Page = async () => {
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            data_key={['data_pangkat']}
            endpoint='/api/kepegawaian/pdinas'
            tableActions={<ActionPDinasTable />}
         />
      </>
   )
}

export default Page

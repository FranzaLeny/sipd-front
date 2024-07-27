import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'

import { ActionSumberDanaTable, helperColumns } from './_components'

export const metadata = {
   title: 'Sumber Dana',
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'Data' }, { title: 'Sumber Dana' }]

const Page = async () => {
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            data_key={['data_sumber_dana']}
            endpoint='/api/perencanaan/data/sumber-dana'
            tableActions={<ActionSumberDanaTable />}
         />
      </>
   )
}

export default Page

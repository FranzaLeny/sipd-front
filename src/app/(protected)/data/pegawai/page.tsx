import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'

import { ActionPegawaiTable, helperColumns } from './_components'

export const metadata = {
   title: 'Pegawai',
}

const PATHS = [{ title: 'Data' }, { title: 'Pegawai' }]

const Page = async () => {
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            data_key={['data_pangkat']}
            endpoint='/api/master/pegawai'
            tableActions={<ActionPegawaiTable />}
         />
      </>
   )
}

export default Page

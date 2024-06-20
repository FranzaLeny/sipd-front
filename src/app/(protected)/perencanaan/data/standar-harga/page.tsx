import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { tipeToKelompok } from '@utils/standar-harga'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionStandarHargaTable, helperColumns } from './_components'

export const metadata = {
   title: 'Standar Harga',
}

type Props = {
   searchParams: {
      tipe?: string
      id_akun?: string
   }
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'Data' }, { title: 'Standar Harga' }]

const Page = async ({ searchParams: { tipe, id_akun } }: Props) => {
   const { hasAccess, user } = await getServerSession([
      'super_admin',
      'admin',
      'perencanaan',
      'admin_perencanaan',
   ])
   if (!hasAccess) return <ErrorPage code={401} />
   const { id_daerah, tahun } = user
   const kelompok = tipeToKelompok(tipe)
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            endpoint='api/perencanaan/master/standar-harga'
            data_key={'data_standar_harga'}
            searchParamsStatic={{ kelompok, tahun, id_akun, id_daerah }}
            tableActions={<ActionStandarHargaTable roles={user?.roles} />}
         />
      </>
   )
}

export default Page

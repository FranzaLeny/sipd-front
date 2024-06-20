import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionAkunTable, helperColumns } from './_components'

export const metadata = {
   title: 'Akun',
}

export type Akun = {
   id: string
   id_akun: number
   is_bagi_hasil: number
   is_barjas: number
   is_bl: number
   is_gaji_asn: number
   is_locked: number
   is_pembiayaan: number
   is_pendapatan: number
   nama_akun: string
   set_input: number
   kode_akun: string
   updated_at: Date
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'Data' }, { title: 'Akun' }]

const Page = async () => {
   const { hasAccess, user } = await getServerSession([
      'super_admin',
      'admin',
      'perencanaan',
      'admin_perencanaan',
   ])
   if (!hasAccess) return <ErrorPage code={401} />
   const { tahun } = user ?? { id_daerah: 0, tahun: 0 }
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            searchParamsStatic={{ tahun }}
            data_key='data_akun'
            endpoint='api/perencanaan/master/akun'
            tableActions={<ActionAkunTable roles={user?.roles} />}
         />
      </>
   )
}

export default Page

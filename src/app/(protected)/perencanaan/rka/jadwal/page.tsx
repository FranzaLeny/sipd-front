import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionTableJadwalAnggaran, helperColumns } from './_components'

export const metadata = {
   title: 'Jadwal',
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'RKA' }, { title: 'Jadwal Anggaran' }]

const Page = async () => {
   const { hasAccess, user } = await getServerSession([
      'super_admin',
      'admin',
      'perencanaan',
      'admin_perencanaan',
   ])
   if (!hasAccess) return <ErrorPage code={401} />
   const { id_daerah, tahun } = user

   return (
      <>
         <Breadcrumb paths={PATHS} />
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={helperColumns}
            data_key={['jadwal_anggaran']}
            searchParamsStatic={{
               tahun,
               id_daerah,
               orderBy: '-waktu_selesai',
               is_rinci_bl: 1,
            }}
            endpoint='/api/perencanaan/rka/jadwal'
            tableActions={<ActionTableJadwalAnggaran />}
         />
      </>
   )
}

export default Page

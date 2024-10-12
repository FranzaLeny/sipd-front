import dynamic from 'next/dynamic'
import Breadcrumb from '@components/ui/Breadcrumbs'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

const CardSyncAkun = dynamic(() => import('./_coponents/card-akun'), { ssr: false })
const CardSyncSkpd = dynamic(() => import('./_coponents/card-skpd'), { ssr: false })
const CardSyncTahapan = dynamic(() => import('./_coponents/card-tahapan'), { ssr: false })
const CardSyncSatuan = dynamic(() => import('./_coponents/card-satuan'), { ssr: false })
const CardSyncSumberDana = dynamic(() => import('./_coponents/card-sumber-dana'), { ssr: false })
const CardSyncStandarHarga = dynamic(() => import('./_coponents/card-standar-harga'), {
   ssr: false,
})

const PATHS = [{ title: 'SIPD' }, { title: 'Perencanaan' }, { title: 'Data Master' }]

export const metadata = {
   title: 'Data Master',
}

const Page = async () => {
   const { user, hasAccess } = await getServerSession(['super_admin', 'admin'])
   if (!hasAccess) return <ErrorPage code={403} />
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <div className='content z-0 h-full'>
            <Card isBlurred>
               <CardHeader>
                  <CardTitle>MASTER DATA PERENCANAAN TAHUN {user?.tahun}</CardTitle>
               </CardHeader>
               <CardContent className='grid grid-cols-1 gap-3 pt-0 lg:grid-cols-3'>
                  {user && (
                     <>
                        <CardSyncAkun
                           data={{
                              id_daerah: user?.id_daerah,
                              tahun: user?.tahun,
                              roles: user?.roles,
                           }}
                        />
                        <CardSyncTahapan
                           data={{
                              id_daerah: user?.id_daerah,
                              tahun: user?.tahun,
                              roles: user?.roles,
                           }}
                        />
                        <CardSyncStandarHarga
                           data={{
                              id_daerah: user?.id_daerah,
                              tahun: user?.tahun,
                              roles: user?.roles,
                           }}
                        />
                        <CardSyncSkpd
                           data={{
                              id_daerah: user?.id_daerah,
                              tahun: user?.tahun,
                              roles: user?.roles,
                              id_unit: user?.id_unit,
                              id_skpd: user?.id_skpd,
                           }}
                        />
                        <CardSyncSumberDana
                           data={{
                              id_daerah: user?.id_daerah,
                              tahun: user?.tahun,
                              roles: user?.roles,
                           }}
                        />
                        <CardSyncSatuan roles={user?.roles} />
                     </>
                  )}
               </CardContent>
            </Card>
         </div>
      </>
   )
}

export default Page

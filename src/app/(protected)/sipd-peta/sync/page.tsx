import dynamic from 'next/dynamic'
import { getJadwalAnggaranAktif } from '@actions/perencanaan/rka/jadwal-anggaran'
import { validateSipdPetaSession } from '@actions/perencanaan/token-sipd'
import Breadcrumb from '@components/ui/Breadcrumbs'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

export const metadata = {
   title: 'Data DPA',
}

const CardDataJadwal = dynamic(() => import('./_components/card-jadwal'), { ssr: false })
const CardDataRak = dynamic(() => import('./_components/card-rak'), { ssr: false })

const getUser = (user: any) => {
   try {
      const { id_level, id_user, id_daerah, id_skpd, tahun, id_unit, roles } =
         validateSipdPetaSession({ user })
      return { id_level, id_user, id_daerah, id_skpd, tahun, id_unit, roles }
   } catch (error) {
      return { id_level: 0, id_user: 0, id_daerah: 0, tahun: 0, id_unit: 0, roles: [] }
   }
}

const PATHS = [{ title: 'SIPD' }, { title: 'Perencanaan' }, { title: 'Data RKA' }]

const getData = async () => {
   try {
      const { user, hasAccess } = await getServerSession(['super_admin', 'admin', 'sipd_peta'])
      if (!hasAccess) {
         return { errorCode: 403, message: 'Anda tidak diizinkan untuk mengakses halaman ini' }
      }
      const jadwal = await getJadwalAnggaranAktif({
         tahun: user.tahun,
         id_daerah: user.id_daerah,
      }).then((res) => res.data)

      if (!!jadwal) {
         return {
            user,
            jadwal_anggaran_id: jadwal?.id,
            id_jadwal_penatausahaan: jadwal?.id_jadwal_penatausahaan ?? 0,
         }
      }
      return { user, jadwal_anggaran_id: '', id_jadwal_penatausahaan: 0 }
   } catch (e: any) {
      let errorCode = 403
      if (e.response?.status) errorCode = e.response?.status
      return { errorCode, message: e?.message }
   }
}
const Page = async () => {
   const data = await getData()
   if ('errorCode' in data)
      return (
         <ErrorPage
            code={data?.errorCode}
            description={data?.message}
         />
      )
   const { user: _user, jadwal_anggaran_id, id_jadwal_penatausahaan } = data
   const user = getUser(_user)

   return (
      <>
         <Breadcrumb paths={PATHS} />
         <div className='content'>
            <Card isBlurred>
               <CardHeader>
                  <CardTitle>Data-Data Penganggran (RKA)</CardTitle>
               </CardHeader>
               <CardContent className='grid grid-cols-1 gap-3 pt-0 lg:grid-cols-3'>
                  <CardDataJadwal
                     data={{
                        id_daerah: user?.id_daerah,
                        tahun: user?.tahun,
                        roles: user?.roles,
                     }}
                  />
                  <CardDataRak
                     data={{
                        id_daerah: user?.id_daerah,
                        id_skpd: user?.id_skpd ?? 0,
                        tahun: user?.tahun,
                        jadwal_anggaran_id: jadwal_anggaran_id,
                        id_jadwal_penatausahaan: id_jadwal_penatausahaan,
                        roles: user?.roles,
                     }}
                  />
               </CardContent>
            </Card>
         </div>
      </>
   )
}

export default Page

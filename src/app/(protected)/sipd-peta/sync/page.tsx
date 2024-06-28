import dynamic from 'next/dynamic'
import { getAllJadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import { validateSipdPetaSession } from '@actions/perencanaan/token-sipd'
import { JadwalAnggaranSearchParams } from '@components/perencanaan/jadwal-anggaran'
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

const getData = async ({ jadwal_anggaran_id }: SearchParams) => {
   try {
      const { user, hasAccess } = await getServerSession(['super_admin', 'admin', 'sipd_peta'])
      if (!hasAccess) {
         return { errorCode: 403, message: 'Anda tidak diizinkan untuk mengakses halaman ini' }
      }
      const listJadwal = await getAllJadwalAnggaran({
         tahun: user.tahun,
         id_daerah: user.id_daerah,
         filter: 'has-rincian',
      })
      const jadwal = listJadwal?.find((d, i) =>
         !!jadwal_anggaran_id
            ? d.id === jadwal_anggaran_id
            : !!d.is_lokal || !!d.is_active || !!d.jadwal_penatausahaan || i === 0
      )
      if (!!jadwal) {
         return {
            listJadwal,
            user,
            jadwal_anggaran_id: jadwal?.id,
            id_jadwal_penatausahaan: jadwal?.id_jadwal_penatausahaan ?? 0,
         }
      }
      return { user, jadwal_anggaran_id: '', id_jadwal_penatausahaan: 0, listJadwal }
   } catch (e: any) {
      let errorCode = 403
      if (e.response?.status) errorCode = e.response?.status
      return { errorCode, message: e?.message }
   }
}

interface Props {
   searchParams: SearchParams
}

interface SearchParams {
   jadwal_anggaran_id?: string
}

const Page = async ({ searchParams }: Props) => {
   const data = await getData(searchParams)
   if ('errorCode' in data)
      return (
         <ErrorPage
            code={data?.errorCode}
            description={data?.message}
         />
      )
   const { user: _user, id_jadwal_penatausahaan, listJadwal, jadwal_anggaran_id } = data
   const user = getUser(_user)

   return (
      <>
         <Breadcrumb paths={PATHS} />
         <div className='content'>
            <JadwalAnggaranSearchParams data={listJadwal} />
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

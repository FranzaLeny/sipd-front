import dynamic from 'next/dynamic'
import { getJadwalAnggaranAktif } from '@actions/perencanaan/rka/jadwal-anggaran'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import Breadcrumb from '@components/ui/Breadcrumbs'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

export const metadata = {
   title: 'Data RKA',
}

const CardDataKeterangan = dynamic(() => import('./_components/card-keterangan'), { ssr: false })
const CardDataKelompok = dynamic(() => import('./_components/card-kelompok'), { ssr: false })
const CardDataJadwal = dynamic(() => import('./_components/card-jadwal'), { ssr: false })
const CardDataSkpd = dynamic(() => import('./_components/card-skpd'), { ssr: false })
const CardDataPendapatan = dynamic(() => import('./_components/card-pendapatan'), { ssr: false })
const CardDataSubGiatAktif = dynamic(() => import('./_components/card-sub-giat-aktif'), {
   ssr: false,
})
const CardDataSubGiatRinci = dynamic(() => import('./_components/card-sub-giat-rinci'), {
   ssr: false,
})

const getUserId = (user: any) => {
   try {
      const { id_level, id_user } = validateSipdSession({ user })
      return { id_level, id_user }
   } catch (error) {
      return { id_level: 0, id_user: 0 }
   }
}

const PATHS = [{ title: 'SIPD' }, { title: 'Perencanaan' }, { title: 'Data RKA' }]

const getData = async () => {
   try {
      const { user, hasAccess } = await getServerSession([
         'super_admin',
         'admin',
         'sipd_ri',
         'admin_perencanaan',
         'perencanaan',
      ])
      if (!hasAccess) {
         return { errorCode: 403, message: 'Anda tidak diizinkan untuk mengakses halaman ini' }
      }
      const jadwal = await getJadwalAnggaranAktif({
         tahun: user.tahun,
         id_daerah: user.id_daerah,
      }).then((res) => res.data)

      if (!!jadwal) {
         return { user, jadwal_anggaran_id: jadwal?.id }
      }
      return { user, jadwal_anggaran_id: '' }
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
   const { user, jadwal_anggaran_id } = data
   const { id_level, id_user } = getUserId(user)
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
                        id_unit: user?.id_unit,
                        jadwal_anggaran_id,
                     }}
                  />
                  <CardDataSkpd
                     data={{
                        id_daerah: user?.id_daerah,
                        tahun: user?.tahun,
                        roles: user?.roles,
                        id_unit: user?.id_unit,
                        id_skpd: user?.id_skpd,
                        id_level: id_level,
                        id_user: id_user,
                        jadwal_anggaran_id,
                     }}
                  />
                  <CardDataPendapatan
                     data={{
                        id_daerah: user?.id_daerah,
                        tahun: user?.tahun,
                        roles: user?.roles,
                        id_unit: user?.id_unit,
                        id_skpd: user?.id_skpd,
                        jadwal_anggaran_id,
                     }}
                  />
                  <CardDataKeterangan
                     data={{
                        id_daerah: user?.id_daerah,
                        tahun: user?.tahun,
                        roles: user?.roles,
                        id_unit: user?.id_unit,
                        id_skpd: user?.id_skpd,
                     }}
                  />
                  <CardDataKelompok
                     data={{
                        id_daerah: user?.id_daerah,
                        tahun: user?.tahun,
                        roles: user?.roles,
                        id_unit: user?.id_unit,
                        id_skpd: user?.id_skpd,
                     }}
                  />
                  <CardDataSubGiatAktif
                     data={{
                        id_daerah: user?.id_daerah,
                        tahun: user?.tahun,
                        roles: user?.roles,
                        id_unit: user?.id_unit,
                        id_skpd: user?.id_skpd,
                        jadwal_anggaran_id,
                        is_prop: user?.is_prop,
                     }}
                  />
                  <CardDataSubGiatRinci
                     data={{
                        id_daerah: user?.id_daerah,
                        tahun: user?.tahun,
                        roles: user?.roles,
                        id_unit: user?.id_unit,
                        id_skpd: user?.id_skpd,
                        jadwal_anggaran_id,
                     }}
                  />
               </CardContent>
            </Card>
         </div>
      </>
   )
}

export default Page

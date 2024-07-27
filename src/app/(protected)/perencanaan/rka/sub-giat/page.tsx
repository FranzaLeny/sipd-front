import { getAllJadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import { JadwalAnggaranSelected } from '@components/perencanaan/jadwal-anggaran'
import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionTableSubGiat, helperColumns, helperColumnsPergeseran } from './_components'

export const metadata = {
   title: 'Sub Kegiatan',
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'RKA' }, { title: 'Sub Kegiatan' }]

interface Props {
   params: Params
   searchParams: SearchParams
}

interface SearchParams {
   jadwal_anggaran_id: string
}

interface Params {}

const Page = async ({ searchParams: { jadwal_anggaran_id } }: Props) => {
   const { hasAccess, user, isAuthenticated } = await getServerSession([
      'super_admin',
      'admin',
      'perencanaan',
      'admin_perencanaan',
      'sipd_ri',
   ])
   if (!hasAccess) return <ErrorPage code={401} />
   const { id_unit, tahun, id_daerah } = user
   const jadwal = await getAllJadwalAnggaran({
      id_daerah: id_daerah,
      tahun: tahun,
      filter: 'has-bl-sub-giat',
   }).catch((e) => {
      let errorCode = 500
      e.response?.status && (errorCode = e.response?.status)
      return { errorCode, message: e?.message }
   })
   if ('errorCode' in jadwal) {
      return (
         <ErrorPage
            code={jadwal.errorCode}
            description={jadwal.message}
         />
      )
   }
   let jadwal_selected = jadwal?.find((d) => d.id === jadwal_anggaran_id)
   if (!jadwal_selected) {
      jadwal_selected = jadwal?.find((d) => !!d.is_active && !d.is_lokal)
   }
   if (!jadwal_selected) {
      jadwal_selected = jadwal[0]
   }
   const isMurni = !jadwal_selected?.id_unik_murni
   const { id, nama_sub_tahap, is_locked, is_active, is_lokal, waktu_selesai } = jadwal_selected

   return (
      <>
         <Breadcrumb paths={PATHS} />
         <div className='sticky left-0 mx-auto mb-2 flex w-full items-center justify-center sm:fixed sm:bottom-2 sm:left-auto sm:right-2 sm:z-10 sm:w-fit'>
            <JadwalAnggaranSelected
               isActive={is_active}
               isLocked={is_locked}
               nama={nama_sub_tahap}
               waktuSelesai={waktu_selesai}
            />
         </div>
         <TableServerSide
            tableUiProps={{ isCompact: true }}
            helperColumns={isMurni ? helperColumns : helperColumnsPergeseran}
            data_key={['bl_sub_giat_aktif', 'bl_sub_giat', 'bl_sub_giat_rinci', 'jadwal_anggaran']}
            searchParamsStatic={{
               id_unit,
               tahun,
               jadwal_anggaran_id: id,
               limit: 10,
            }}
            endpoint='/api/perencanaan/rka/sub-giat/aktif'
            tableActions={
               <ActionTableSubGiat
                  jadwal={jadwal}
                  jadwal_selected={jadwal_selected.id}
                  tahun={jadwal_selected.tahun}
                  roles={user?.roles}
                  idUnit={user?.id_unit}
                  idSkpd={user?.id_skpd}
               />
            }
         />
      </>
   )
}

export default Page

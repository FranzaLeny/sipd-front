import { getAllJadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import { JadwalAnggaranSelected } from '@components/perencanaan/jadwal-anggaran'
import TableServerSide from '@components/table'
import Breadcrumb from '@components/ui/Breadcrumbs'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import { ActionTablePendapatan, helperColumns } from './_components'

export const metadata = {
   title: 'Pendapatan',
}

const PATHS = [{ title: 'Perencanaan' }, { title: 'RKA' }, { title: 'Pendapatan' }]

interface Props {
   params: Params
   searchParams: SearchParams
}

interface SearchParams {
   jadwal_anggaran_id: string
}

interface Params {}

const Page = async ({ searchParams: { jadwal_anggaran_id } }: Props) => {
   const { user, hasAccess } = await getServerSession([
      'super_admin',
      'admin',
      'perencanaan',
      'admin_perencanaan',
   ])
   if (!hasAccess) return <ErrorPage code={403} />
   const { id_daerah, tahun, id_skpd, id_unit } = user
   const jadwal = await getAllJadwalAnggaran({
      id_daerah: id_daerah,
      tahun: tahun,
      filter: 'has-pendapatan',
   }).catch((e) => {
      let errorCode = 500
      e.response?.status && (errorCode = e.response?.status)
      return { errorCode, message: e?.message }
   })

   if ('errorCode' in jadwal)
      return (
         <ErrorPage
            code={jadwal.errorCode}
            description={jadwal.message}
         />
      )
   let jadwal_selected = jadwal?.find((d) => d.id === jadwal_anggaran_id)
   if (!jadwal_selected) {
      jadwal_selected = jadwal?.find((d) => !!d.is_active && !!d.is_lokal)
   }
   if (!jadwal_selected) {
      jadwal_selected = jadwal[0]
   }
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
         {!!jadwal_selected ? (
            <>
               <TableServerSide
                  tableUiProps={{ isCompact: true }}
                  helperColumns={helperColumns}
                  data_key={['bl_pendapatan', 'jadwal_anggaran']}
                  searchParamsStatic={{ tahun, id_daerah, jadwal_anggaran_id: id, id_skpd }}
                  endpoint='/api/perencanaan/rka/pendapatan'
                  tableActions={
                     <ActionTablePendapatan
                        jadwal={jadwal}
                        roles={user?.roles}
                        jadawal_anggaran_id={id}
                        id_skpd={id_skpd}
                        id_unit={id_unit}
                        tahun={tahun}
                     />
                  }
               />
            </>
         ) : (
            <div>Data jadwal anggaran tidak ditemukan</div>
         )}
      </>
   )
}

export default Page

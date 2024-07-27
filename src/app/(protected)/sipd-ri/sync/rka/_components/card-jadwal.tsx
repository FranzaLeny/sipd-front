'use client'

import { useMemo, useState } from 'react'
import {
   checkJadwalAnggaranAktif,
   getJadwalAnggaranFromSipd,
   GetJadwalAnggaranParams,
   getTotalJadwalAnggaran,
} from '@actions/perencanaan/rka/jadwal-anggaran'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import hasAccess from '@utils/chek-roles'

import CardData from './card-data'

type Props = {
   data: {
      id_daerah: number
      tahun: number
      roles?: string[] | undefined | null
      id_unit: number
      jadwal_anggaran_id: string
   }
}
function CardDataJadwal({ data }: Props) {
   const access = useMemo(() => {
      const sipd_ri = hasAccess(['sipd_ri'], data?.roles)
      const lokal = hasAccess(
         ['super_admin', 'admin', 'admin_perencanaan', 'perencanaan'],
         data?.roles
      )
      const sync = sipd_ri && hasAccess(['super_admin', 'admin', 'admin_perencanaan'], data?.roles)
      return { sipd_ri, lokal, sync }
   }, [data?.roles])
   const [enabled, setEnabled] = useState(false)

   const lokal = useQuery({
      queryKey: [
         { id_daerah: data?.id_daerah, tahun: data?.tahun },
         'jadwal_anggaran',
         'total',
      ] as [GetJadwalAnggaranParams, ...any],
      queryFn: async ({ queryKey: [q] }) => await getTotalJadwalAnggaran(q),
      refetchOnMount: false,
      enabled: enabled && access.lokal,
   })

   const sipd = useQuery({
      queryKey: [data, 'jadwal_anggaran_sipd'] as [Props['data'], string],
      queryFn: async ({ queryKey: [q] }) =>
         await getJadwalAnggaranFromSipd({ id_daerah: q.id_daerah, tahun: q.tahun }).then(
            (d) => d.length
         ),
      refetchOnMount: false,
      enabled: enabled && access.sipd_ri,
   })

   const active = useQuery({
      queryKey: [{ id_daerah: data?.id_daerah, tahun: data?.tahun }, 'jadwal_anggaran'] as [
         JadwalAnggranCekAktifSipdPayload & { is_lokal?: number },
         ...any,
      ],
      queryFn: async ({ queryKey: [q] }) => await checkJadwalAnggaranAktif(q),
      refetchOnMount: false,
      enabled: enabled && access.sync,
   })

   return (
      <Card
         radius='lg'
         as={'div'}
         isPressable
         onPress={() => setEnabled(true)}
         className='max-w-full sm:p-2'>
         <CardBody className='space-y-3'>
            <h4 className='text-lg font-semibold leading-6'>Jadwal Anggaran</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data Jadwal Penganggaran antara sistem{' '}
               <span className='font-semibold'>(Lokal)</span> dan sistem{' '}
               <span className='font-semibold'>(SIPD-RI)</span> terbaru.
            </p>
            <div className='flex items-center justify-around'>
               <CardData
                  canPres={enabled && access.lokal}
                  hasAccess={access.lokal}
                  results={lokal}
                  title='Lokal'
                  action_title='Lihat'
                  action_path='/perencanaan/rka/jadwal'
               />
               <CardData
                  canPres={enabled && lokal.isFetched && access.sipd_ri}
                  results={sipd}
                  hasAccess={access.sync}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/rka/jadwal'
               />
               <CardData
                  canPres={enabled && access.sipd_ri}
                  results={active}
                  hasAccess={access.sync}
                  key_value='is_active'
                  title='Aktif'
                  action_title='Update'
                  action_path='/sipd-ri/sync/rka/jadwal/aktif'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataJadwal

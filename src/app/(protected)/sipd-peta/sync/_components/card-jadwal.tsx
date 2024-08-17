'use client'

import { useMemo, useState } from 'react'
import { getJadwaPergeseranDpaFromSipd } from '@actions/penatausahaan/pengeluaran/jadwal'
import { getAllJadwalAnggaran } from '@actions/perencanaan/rka/jadwal-anggaran'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import hasAccess from '@utils/chek-roles'

import CardData from './card-data'

type Props = {
   data: {
      id_daerah: number

      tahun: number
      roles?: string[] | undefined | null
   }
}
function CardDataJadwal({ data }: Props) {
   const access = useMemo(() => {
      const sipd_peta = hasAccess(['sipd_peta'], data?.roles)
      const lokal = hasAccess(['super_admin', 'admin'], data?.roles)
      const sync = sipd_peta && hasAccess(['super_admin', 'admin'], data?.roles)
      return { sipd_peta, lokal, sync }
   }, [data?.roles])
   const [enabled, setEnabled] = useState(false)

   const lokal = useQuery({
      queryKey: [
         { id_daerah: data?.id_daerah, tahun: data?.tahun, jadwal_penatausahaan: 'true' },
         'jadwal_anggaran',
         'jadwal_anggaran_penatausahaan',
      ] as [GetAllJadwalAnggaranParams, ...any],
      queryFn: async ({ queryKey: [q] }) => await getAllJadwalAnggaran(q),
      refetchOnMount: false,
      enabled: enabled && access.lokal,
   })

   const sipd = useQuery({
      queryKey: ['jadwal_dpa'],
      queryFn: async () => await getJadwaPergeseranDpaFromSipd(),
      refetchOnMount: false,
      enabled: enabled && access.sipd_peta,
   })

   return (
      <Card
         radius='lg'
         as={'div'}
         isPressable
         onPress={() => setEnabled(true)}
         className='max-w-full sm:p-2'>
         <CardBody className='space-y-3'>
            <h4 className='text-lg font-semibold leading-6'>Jadwal Penatausahaan</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data Jadwal Penatausahaan antara sistem{' '}
               <span className='font-semibold'>(Lokal)</span> dan sistem{' '}
               <span className='font-semibold'>(SIPD-Penatausahaan)</span> terbaru.
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
                  canPres={enabled && lokal.isFetched && access.sipd_peta}
                  results={sipd}
                  hasAccess={access.sync}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-peta/sync/jadwal'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataJadwal

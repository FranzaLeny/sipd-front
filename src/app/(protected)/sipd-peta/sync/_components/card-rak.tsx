'use client'

import { useMemo, useState } from 'react'
import {
   getRakSkpdBlBySkpd,
   getRakSkpdSipdPetaBySkpd,
} from '@actions/penatausahaan/pengeluaran/rak'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import hasAccess from '@utils/chek-roles'

import CardData from './card-data'

type Props = {
   data: {
      jadwal_anggaran_id: string
      id_jadwal_penatausahaan: number
      id_daerah: number
      id_skpd: number
      tahun: number
      roles?: string[] | undefined | null
   }
}
function CardDataRak({ data }: Props) {
   const access = useMemo(() => {
      const sipd_peta = hasAccess(['sipd_peta'], data?.roles)
      const lokal = hasAccess(['super_admin', 'admin'], data?.roles)
      const sync = sipd_peta && !!data.id_jadwal_penatausahaan
      return { sipd_peta, lokal, sync }
   }, [data])
   const [enabled, setEnabled] = useState(false)

   const lokal = useQuery({
      queryKey: [
         { id_skpd: data?.id_skpd, jadwal_anggaran_id: data?.jadwal_anggaran_id },
         'rak_skpd',
         'rak',
      ] as [
         {
            jadwal_anggaran_id: string
            id_skpd: number
         },
         ...any,
      ],
      queryFn: async ({ queryKey: [q] }) => await getRakSkpdBlBySkpd(q),
      refetchOnMount: false,
      enabled: enabled && access.lokal,
   })

   const sipd = useQuery({
      queryKey: [data?.id_skpd, 'rak_skpd_sipd_peta'] as [number, ...any],
      queryFn: async ({ queryKey: [q] }) => await getRakSkpdSipdPetaBySkpd(q),
      refetchOnMount: false,
      enabled: enabled && access.sipd_peta && !!data?.id_skpd,
   })

   return (
      <Card
         radius='lg'
         as={'div'}
         isPressable
         onPress={() => setEnabled(true)}
         className='max-w-full sm:p-2'>
         <CardBody className='space-y-3'>
            <h4 className='text-lg font-semibold leading-6'>Anggaran Khas Belanja</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data Anggaran Khas Belanja antara sistem{' '}
               <span className='font-semibold'>(Lokal)</span> dan sistem{' '}
               <span className='font-semibold'>(SIPD-Penatausahaan)</span> terbaru.
            </p>
            <div className='flex items-center justify-around'>
               <CardData
                  canPres={enabled && access.lokal}
                  hasAccess={access.lokal}
                  results={lokal}
                  key_value='nilai_rak'
                  title='RAK Lokal'
                  action_title='Lihat'
                  action_path='/perencanaan/rka/jadwal'
               />
               <CardData
                  canPres={enabled && lokal.isFetched && access.sipd_peta}
                  results={sipd}
                  hasAccess={access.sync}
                  key_value='nilai_rak'
                  title='RAK SIPD'
                  action_title='Update'
                  action_path='/sipd-peta/sync/rak'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataRak

'use client'

import { useMemo, useState } from 'react'
import {
   getKetRinciBlSubGiatBySkpdSipd,
   getTotalKetRinciBlSubGiat,
} from '@actions/perencanaan/rka/bl-rinci-sub-giat'
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
      id_skpd: number
   }
}
function CardDataKeterangan({ data }: Props) {
   const [enabled, setEnabled] = useState(false)

   const access = useMemo(() => {
      const sipd_ri = hasAccess(['sipd_ri'], data?.roles)
      const lokal = hasAccess(
         ['super_admin', 'admin', 'admin_perencanaan', 'perencanaan'],
         data?.roles
      )
      const sync = sipd_ri && hasAccess(['super_admin', 'admin', 'admin_perencanaan'], data?.roles)
      return { sipd_ri, lokal, sync }
   }, [data?.roles])

   const lokal = useQuery({
      queryKey: [
         {
            id_skpd: data.id_unit === data.id_skpd ? undefined : data.id_skpd,
            id_unit: data?.id_unit,
            tahun: data?.tahun,
            id_daerah: data?.id_daerah,
         },
         'bl_sub_giat_rinci_ket',
         'total',
      ] as [Partial<GetKetRinciParams>, ...any],
      queryFn: async ({ queryKey: [params] }) => {
         return await getTotalKetRinciBlSubGiat(params)
      },
      refetchOnMount: false,
      enabled: enabled && access.lokal,
   })

   const sipd = useQuery({
      queryKey: [
         { id_daerah: data?.id_daerah, id_unit: data?.id_unit, tahun: data?.tahun },
         'bl_sub_giat_rinci_ket_sipd',
      ] as [ListKetRinciBlSubGiatByDaerahSipdPayload, string],
      queryFn: async ({ queryKey: [q] }) => await getKetRinciBlSubGiatBySkpdSipd(q),
      refetchOnMount: false,
      enabled: enabled && access.sipd_ri,
   })

   return (
      <Card
         radius='lg'
         as={'div'}
         isPressable
         onPress={() => setEnabled(true)}
         className='max-w-full sm:p-2'>
         <CardBody className='space-y-3'>
            <h4 className='text-lg font-semibold leading-6'>Keterangan Rincian Sub Kegiatan</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data Keterangan rincian belanja sub
               kegiatan antara sistem <span className='font-semibold'>(Lokal)</span> dan sistem{' '}
               <span className='font-semibold'>(SIPD-RI)</span> terbaru.
            </p>
            <div className='flex items-center justify-around'>
               <CardData
                  canPres={enabled && access.lokal}
                  hasAccess={access.lokal}
                  results={lokal}
                  title='Lokal'
                  action_title='Lihat'
                  key_value='totalCount'
                  action_path='/perencanaan/rka/sub-giat'
               />
               <CardData
                  canPres={enabled && access.sipd_ri}
                  hasAccess={access.sync}
                  key_value='recordsFilter'
                  results={sipd}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/rka/sub-giat/rinci/ket'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataKeterangan

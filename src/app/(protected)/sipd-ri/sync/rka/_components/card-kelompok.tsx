'use client'

import { useMemo, useState } from 'react'
import {
   getSubsRinciBlSubGiatBySkpdSipd,
   GetSubsRinciListParams,
   getTotalSubsRinciBlSubGiat,
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
function CardDataKelompok({ data }: Props) {
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
            id_daerah: data.id_daerah,
            tahun: data.tahun,
            id_unit: data.id_unit,
            id_skpd: data.id_unit === data.id_skpd ? undefined : data.id_skpd,
         },
         'bl_sub_giat_rinci_subs',
         'total',
      ] as [Partial<GetSubsRinciListParams>, ...any],
      queryFn: async ({ queryKey: [params] }) => {
         return await getTotalSubsRinciBlSubGiat(params)
      },
      refetchOnMount: false,
      enabled: access.lokal && enabled,
   })

   const sipd = useQuery({
      queryKey: [
         { id_daerah: data.id_daerah, tahun: data.tahun, id_unit: data.id_unit },
         'bl_sub_giat_rinci_subs_sipd',
      ] as [ListSubsRinciBlSubGiatSipdPayload & { id_unit: number }, string],
      queryFn: async ({ queryKey: [q] }) => await getSubsRinciBlSubGiatBySkpdSipd(q),
      refetchOnMount: false,
      enabled: access.sipd_ri && enabled,
   })

   return (
      <Card
         radius='lg'
         as={'div'}
         isPressable
         onPress={() => setEnabled(true)}
         className='max-w-full sm:p-2'>
         <CardBody className='space-y-3'>
            <h4 className='text-lg font-semibold leading-6'>Kelompok Rincian Sub Kegiatan</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data Kelompok rincian belanja sub kegiatan
               antara sistem <span className='font-semibold'>(Lokal)</span> dan sistem{' '}
               <span className='font-semibold'>(SIPD-RI)</span> terbaru.
            </p>
            <div className='flex items-center justify-around'>
               <CardData
                  canPres={enabled && access.lokal}
                  hasAccess={access.lokal}
                  results={lokal}
                  title='Lokal'
                  action_title='Lihat'
                  action_path='/perencanaan/rka/sub-giat'
               />
               <CardData
                  hasAccess={enabled && access.sipd_ri}
                  canPres={access.sync}
                  results={sipd}
                  key_value='recordsFilter'
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/rka/sub-giat/rinci/subs'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataKelompok

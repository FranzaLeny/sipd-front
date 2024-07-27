'use client'

import { useMemo, useState } from 'react'
import {
   getListRinciBlSubGiatBySkpdSipd,
   GetRinciListParams,
   getTotalRinciBlSubGiat,
} from '@actions/perencanaan/rka/bl-rinci-sub-giat'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import hasAccess from '@utils/chek-roles'

import CardData from './card-data'

type Props = {
   data: {
      id_daerah: number
      tahun: number
      roles?: string[]
      id_unit: number
      id_skpd: number
      jadwal_anggaran_id: string
   }
}
function CardDataSubGiatRinci({ data }: Props) {
   const [enabled, setEnabled] = useState(false)

   const access = useMemo(() => {
      const sipd_ri = hasAccess(['sipd_ri'], data?.roles) && !!data.jadwal_anggaran_id
      const lokal =
         hasAccess(['super_admin', 'admin', 'admin_perencanaan', 'perencanaan'], data?.roles) &&
         !!data.jadwal_anggaran_id
      const sync =
         sipd_ri &&
         hasAccess(['super_admin', 'admin', 'admin_perencanaan'], data?.roles) &&
         !!data.jadwal_anggaran_id
      return { sipd_ri, lokal, sync }
   }, [data?.roles, data.jadwal_anggaran_id])

   const lokal = useQuery({
      queryKey: [
         {
            id_daerah: data?.id_daerah,
            tahun: data?.tahun,
            id_unit: data?.id_unit,
            id_skpd: data.id_unit === data.id_skpd ? undefined : data.id_skpd,
            jadwal_anggaran_id: data?.jadwal_anggaran_id,
         },
         'bl_sub_giat_rinci',
         'total',
         'jadwal_anggaran',
      ] as [GetRinciListParams, ...any],
      queryFn: async ({ queryKey: [q] }) => {
         return await getTotalRinciBlSubGiat(q)
      },
      refetchOnMount: false,
      enabled: enabled && access.lokal && !!data?.jadwal_anggaran_id,
   })

   const sipd = useQuery({
      queryKey: [data, 'bl_sub_giat_rinci_sipd'] as [Props['data'], string],
      queryFn: async ({ queryKey: [q] }) =>
         await getListRinciBlSubGiatBySkpdSipd({
            id_daerah: q.id_daerah,
            tahun: q.tahun,
            id_skpd: q.id_skpd,
         }).then((d) => {
            return d.length
         }),
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
            <h4 className='text-lg font-semibold leading-6'>Rincian Sub Kegiatan</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data Rincian belanja sub kegiatan antara
               sistem <span className='font-semibold'>(Lokal)</span> dan sistem{' '}
               <span className='font-semibold'>(SIPD-RI)</span> terbaru.
            </p>
            <div className='flex items-center justify-around'>
               <CardData
                  canPres={enabled && access.lokal && !!data?.jadwal_anggaran_id}
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
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/rka/sub-giat/rinci'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataSubGiatRinci

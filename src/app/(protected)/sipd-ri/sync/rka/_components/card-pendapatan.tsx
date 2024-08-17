'use client'

import { useMemo, useState } from 'react'
import {
   getListPendapatanByUnitSipd,
   getTotalPendapatan,
} from '@actions/perencanaan/rka/pendapatan'
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
      jadwal_anggaran_id: string
   }
}
function CardDataPendapatan({ data }: Props) {
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

   const sipd = useQuery({
      queryKey: [
         { id_daerah: data.id_daerah, tahun: data.tahun, id_unit: data.id_unit },
         'bl_pendapatan_sipd',
      ] as [ListPendapatanByUnitSipdPayload, string],
      queryFn: async ({ queryKey: [params] }) => {
         return await getListPendapatanByUnitSipd(params)
      },
      refetchOnMount: false,
      enabled: access.lokal && enabled,
   })

   const lokal = useQuery({
      queryKey: [
         {
            id_unit: data.id_unit,
            id_skpd: data.id_unit === data.id_skpd ? undefined : data.id_skpd,
            jadwal_anggaran_id: data.jadwal_anggaran_id,
         },
         'bl_pendapatan',
         'total',
         'jadwal_anggaran',
      ] as [GetPendapatanParams, ...any],
      queryFn: async ({ queryKey: [q] }) => await getTotalPendapatan(q),
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
            <h4 className='text-lg font-semibold leading-6'>Pendapatan</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data Pendaptan SKPD anda antara sistem{' '}
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
                  action_path='/perencanaan/rka/pendapatan'
               />
               <CardData
                  hasAccess={enabled && access.sipd_ri}
                  canPres={access.sync}
                  results={sipd}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/rka/pendapatan'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataPendapatan

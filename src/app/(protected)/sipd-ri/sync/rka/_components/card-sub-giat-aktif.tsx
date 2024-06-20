'use client'

import { useMemo, useState } from 'react'
import {
   getBlSubGiatAktifSipd,
   GetSubGiatListParams,
   getTotalBlSubGiatAktif,
} from '@actions/perencanaan/rka/bl-sub-giat'
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
      is_prop: number
      jadwal_anggaran_id: string
   }
}
function CardDataSubGiatAktif({ data }: Props) {
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
         'bl_sub_giat_aktif',
         'total_bl_sub_giat_aktif',
      ] as [Partial<GetSubGiatListParams>, ...any],
      queryFn: async ({ queryKey: [q] }) => {
         const { id_daerah, tahun, id_unit, id_skpd, jadwal_anggaran_id } = q
         return getTotalBlSubGiatAktif({
            id_daerah,
            tahun,
            id_unit,
            id_skpd: id_skpd !== id_unit ? id_skpd : undefined,
            jadwal_anggaran_id,
         })
      },
      refetchOnMount: false,
      enabled: enabled && access.lokal && !!data?.jadwal_anggaran_id,
   })

   const sipd = useQuery({
      queryKey: [data, 'sub_giat_aktif_sipd'] as [Props['data'], string],
      queryFn: async ({ queryKey: [q] }) =>
         await getBlSubGiatAktifSipd({
            id_daerah: q.id_daerah,
            tahun: q.tahun,
            id_unit: q.id_unit,
            is_anggaran: 1,
            is_prop: q.is_prop,
         }).then((d) => d.length),
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
            <h4 className='text-lg font-semibold leading-6'>Sub Kegiatan Aktif</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data belanja Sub Kegiatan Aktif antara
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
                  action_path='/sipd-ri/sync/rka/sub-giat'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataSubGiatAktif

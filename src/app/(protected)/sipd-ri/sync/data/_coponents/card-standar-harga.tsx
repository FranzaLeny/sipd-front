'use client'

import { useMemo, useState } from 'react'
import {
   getTolalStandarHarga,
   getTotalStandarHargaSipd,
} from '@actions/perencanaan/data/standar-harga'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import hasAccess from '@utils/chek-roles'
import { StandarHargaQuery } from '@zod'

import CardData from './card-data'

type Props = { data: { id_daerah: number; tahun: number; roles?: string[] } }

function CardDataStandarHarga({ data }: Props) {
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
         { id_daerah: data.id_daerah, tahun: data.tahun },
         'data_standar_harga',
         'total_standar_harga',
      ] as [StandarHargaQuery, ...any],
      queryFn: async ({ queryKey: [params] }) => {
         return await getTolalStandarHarga(params)
      },
      refetchOnMount: false,
      enabled: access.lokal && enabled,
   })
   const id_akun = {
      id_akun: JSON.stringify({ isEmpty: true }),
   }
   const lokal_with_akun = useQuery({
      queryKey: [
         { id_daerah: data.id_daerah, tahun: data.tahun, ...id_akun },
         'data_standar_harga',
         'total_standar_harga',
      ] as [StandarHargaQuery, ...any],
      queryFn: async ({ queryKey: [params] }) => {
         return await getTolalStandarHarga(params)
      },
      refetchOnMount: false,
      enabled: access.lokal && enabled,
   })

   const sipd = useQuery({
      queryKey: [{ id_daerah: data.id_daerah, tahun: data.tahun }, 'data_standar_harga_sipd'] as [
         Omit<Omit<ListStandarHargaSipdPayload, 'tipe'>, 'kelompok'>,
         string,
      ],
      queryFn: async ({ queryKey: [params] }) =>
         await getTotalStandarHargaSipd(params).then((d) => {
            return d?.reduce((total, current) => total + current?.recordsTotal, 0)
         }),
      refetchOnMount: false,
      enabled: access.sipd_ri && enabled,
   })

   const searchParams = new URLSearchParams(id_akun).toString()
   return (
      <Card
         radius='lg'
         as={'div'}
         isPressable
         onPress={() => setEnabled(true)}
         className='max-w-full sm:p-2'>
         <CardBody className='space-y-3'>
            <h4 className='text-lg font-semibold leading-6'>Data Standar Harga</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data komponen Standar Harga antara sistem{' '}
               <span className='font-semibold'>(Lokal)</span> dan sistem{' '}
               <span className='font-semibold'>(SIPD-RI)</span> terbaru.
            </p>
            <div className='flex items-center justify-around'>
               <CardData
                  key={'akun'}
                  canPres={enabled && access.lokal}
                  hasAccess={access.lokal}
                  results={lokal_with_akun}
                  title='Tanpa Akun'
                  action_title='Lihat'
                  action_path={`/perencanaan/data/standar-harga?${searchParams}`}
               />
               <CardData
                  canPres={enabled && access.lokal}
                  hasAccess={access.lokal}
                  results={lokal}
                  title='Lokal'
                  action_title='Lihat'
                  action_path={`/perencanaan/data/standar-harga?${searchParams}`}
               />
               <CardData
                  canPres={enabled && access.sipd_ri}
                  hasAccess={access.sync}
                  results={sipd}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/data/standar-harga'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataStandarHarga

'use client'

import { useMemo, useState } from 'react'
import { getListNewSkpdSipd, getTolalSkpd, SkpdParams } from '@actions/perencanaan/data/skpd'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import hasAccess from '@utils/chek-roles'

import CardData from './card-data'

type Props = {
   data: { id_daerah: number; id_unit: number; id_skpd: number; tahun: number; roles?: string[] }
}
function CardDataSkpd({ data }: Props) {
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
      queryKey: [{ id_daerah: data.id_daerah, tahun: data.tahun }, 'data_skpd', 'total_skpd'] as [
         SkpdParams,
         ...any,
      ],
      queryFn: async ({ queryKey: [q] }) => {
         return await getTolalSkpd(q)
      },
      refetchOnMount: false,
      enabled: enabled && access.lokal,
   })
   const sipd = useQuery({
      queryKey: [{ id_daerah: data.id_daerah, tahun: data.tahun, length: 1 }, 'data_skpd_sipd'] as [
         SkpdListSipdPayload,
         string,
      ],
      queryFn: async ({ queryKey: [q] }) => await getListNewSkpdSipd(q),
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
            <h4 className='text-lg font-semibold leading-6'>Data Skpd</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data SKPD antara sistem{' '}
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
                  action_path='/perencanaan/data/skpd'
               />
               <CardData
                  canPres={enabled && access.sipd_ri}
                  hasAccess={access.sync}
                  results={sipd}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/data/skpd'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardDataSkpd

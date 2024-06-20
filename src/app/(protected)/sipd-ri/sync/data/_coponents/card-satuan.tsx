'use client'

import { useMemo, useState } from 'react'
import { getListSatuanSipd, getTolalSatuan } from '@actions/perencanaan/data/satuan'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import hasAccess from '@utils/chek-roles'

import CardData from './card-data'

type Props = { roles?: string[] }

function CardSatuan({ roles }: Props) {
   const [enabled, setEnabled] = useState(false)

   const access = useMemo(() => {
      const sipd_ri = hasAccess(['sipd_ri'], roles)
      const lokal = hasAccess(['super_admin', 'admin', 'admin_perencanaan', 'perencanaan'], roles)
      const sync = sipd_ri && hasAccess(['super_admin', 'admin', 'admin_perencanaan'], roles)
      return { sipd_ri, lokal, sync }
   }, [roles])

   const lokal = useQuery({
      queryKey: ['data_satuan', 'total_satuan'],
      queryFn: async () => {
         return await getTolalSatuan()
      },
      refetchOnMount: false,
      enabled: access.lokal && enabled,
   })

   const sipd = useQuery({
      queryKey: [{ length: 1 }, 'data_satuan_sipd'] as [ListSatuanSipdPayload, string],
      queryFn: async ({ queryKey: [q] }) => await getListSatuanSipd(q),
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
            <h4 className='text-lg font-semibold leading-6'>Data Satuan</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data Satuan komponen belanja antara sistem{' '}
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
                  action_path='/perencanaan/data/satuan'
               />
               <CardData
                  hasAccess={enabled && access.sipd_ri}
                  canPres={access.sync}
                  results={sipd}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/data/satuan'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardSatuan

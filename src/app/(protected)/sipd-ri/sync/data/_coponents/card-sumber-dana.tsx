'use client'

import { useMemo, useState } from 'react'
import { getListSumberDanaSipd, getTotalSumberDana } from '@actions/perencanaan/data/sumber-dana'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import hasAccess from '@utils/chek-roles'

import CardData from './card-data'

type Props = { data: { roles?: string[]; tahun: number; id_daerah: number } }

function CardSatuan({ data: { roles, tahun, id_daerah } }: Props) {
   const [enabled, setEnabled] = useState(false)

   const access = useMemo(() => {
      const sipd_ri = hasAccess(['sipd_ri'], roles) && !!tahun && !!id_daerah
      const lokal =
         hasAccess(['super_admin', 'admin', 'admin_perencanaan', 'perencanaan'], roles) && !!tahun
      const sync = sipd_ri && hasAccess(['super_admin', 'admin', 'admin_perencanaan'], roles)
      return { sipd_ri, lokal, sync }
   }, [roles, tahun, id_daerah])

   const lokal = useQuery({
      queryKey: [{ tahun }, 'data_sumber_dana', 'total_sumber_dana'] as [
         GetListSumberDanaParams,
         ...any,
      ],
      queryFn: async ({ queryKey: [q] }) => {
         return await getTotalSumberDana(q)
      },
      refetchOnMount: false,
      enabled: access.lokal && enabled,
   })

   const sipd = useQuery({
      queryKey: [{ id_daerah, tahun, length: 1 }, 'data_sumber_dana_sipd'] as [
         ListSumberDanaSipdPayload,
         string,
      ],
      queryFn: async ({ queryKey: [q] }) => await getListSumberDanaSipd(q),
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
            <h4 className='text-lg font-semibold leading-6'>Data Sumber Dana</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data sumber dana antara sistem{' '}
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
                  action_path='/perencanaan/data/sumber-dana'
               />
               <CardData
                  hasAccess={enabled && access.sipd_ri}
                  canPres={access.sync}
                  results={sipd}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/data/sumber-dana'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardSatuan

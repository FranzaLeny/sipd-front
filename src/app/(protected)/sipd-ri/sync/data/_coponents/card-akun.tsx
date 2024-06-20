'use client'

import { useMemo, useState } from 'react'
import { GetAkunListParams, getListAkunSipd, getTolalAkun } from '@actions/perencanaan/data/akun'
import { Card, CardBody } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import hasAccess from '@utils/chek-roles'

import CardData from './card-data'

type Props = { data: { id_daerah: number; tahun: number; roles?: string[] } }
function CardSyncAkun({ data }: Props) {
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
      queryKey: [{ tahun: data.tahun }, 'total_akun', 'data_akun'] as [GetAkunListParams, ...any],
      queryFn: async ({ queryKey: [params] }) => {
         return await getTolalAkun(params)
      },
      refetchOnMount: false,
      enabled: enabled && access.lokal,
   })
   const sipd = useQuery({
      queryKey: [{ id_daerah: data.id_daerah, tahun: data.tahun }, 'data_akun_sipd'] as [
         ListAkunSipdPayload,
         string,
      ],
      queryFn: async ({ queryKey: [q] }) => await getListAkunSipd(q),
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
            <h4 className='text-lg font-semibold leading-6'>Data Akun</h4>
            <p className='text-justify text-sm'>
               Klik tombol &quot;Update&quot; penyesuaian data Akun belanja antara sistem{' '}
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
                  action_path='/perencanaan/data/akun'
               />
               <CardData
                  canPres={enabled && access.sipd_ri}
                  hasAccess={access.sync}
                  results={sipd}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/data/akun'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardSyncAkun

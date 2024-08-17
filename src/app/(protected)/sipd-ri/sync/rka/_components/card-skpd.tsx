'use client'

import { useMemo, useState } from 'react'
import { getListBlSkpd, getListBlSkpdSipd, getTotalBlSkpd } from '@actions/perencanaan/rka/bl-skpd'
import { Card, CardBody } from '@nextui-org/react'
import { useLocale } from '@react-aria/i18n'
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
      id_user: number
      id_level: number
      jadwal_anggaran_id: string
   }
}
function CardSkpd({ data }: Props) {
   const [enabled, setEnabled] = useState(false)
   const { locale } = useLocale()
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
      queryKey: [data, 'bl_skpd_sipd'] as [Props['data'], ...any],
      queryFn: async ({ queryKey: [q] }) => {
         const data = await getListBlSkpdSipd({
            id_daerah: q.id_daerah,
            id_level: q.id_level,
            tahun: q.tahun,
            is_anggaran: 1,
            id_unit: q.id_unit,
            id_user: q.id_user,
            limit: 1000,
         })
         return { data: data?.data?.find((d) => d.id_skpd === q.id_skpd), total: data.recordsTotal }
      },
      refetchOnMount: false,
      enabled: enabled && access.sipd_ri,
   })

   const lokalUnit = useQuery({
      queryKey: [
         {
            id_unit: data?.id_unit,
            jadwal_anggaran_id: data?.jadwal_anggaran_id,
         },
         'bl_skpd',
      ] as [GetListBlSkpdParams, ...any],
      queryFn: async ({ queryKey: [params] }) => await getListBlSkpd(params),
      refetchOnMount: false,
      enabled: enabled && access.lokal,
   })
   const lokal = useQuery({
      queryKey: [
         {
            jadwal_anggaran_id: data?.jadwal_anggaran_id,
         },
         'bl_skpd',
         'total',
         'jadwal_anggaran',
      ] as [GetBlSkpdParams, ...any],
      queryFn: async ({ queryKey: [params] }) => await getTotalBlSkpd(params),
      refetchOnMount: false,
      enabled: enabled && access.lokal,
   })
   const skpdLokal = lokalUnit?.data?.results[0]
   const handlePress = () => {
      setEnabled(true)
      lokalUnit.refetch()
   }
   return (
      <Card
         radius='lg'
         as={'div'}
         isPressable
         onPress={handlePress}
         className='max-w-full sm:p-2'>
         <CardBody className='space-y-3'>
            <h4 className='text-lg font-semibold leading-6'>Belanja SKPD</h4>
            <div className='text-sm'>
               <table className='min-w-full'>
                  <tbody>
                     <tr>
                        <td>Pagu Rincian</td>
                        <td className='text-end'>
                           {skpdLokal?.set_pagu_skpd?.toLocaleString(locale) ?? 0}
                        </td>
                        <td className='text-end'>
                           {sipd?.data?.data?.set_pagu_skpd.toLocaleString(locale) ?? 0}
                        </td>
                     </tr>
                     <tr>
                        <td>Jml. Sub</td>
                        <td className='text-end'>
                           {skpdLokal?.total_giat.toLocaleString(locale) ?? 0}
                        </td>
                        <td className='text-end'>
                           {sipd?.data?.data?.total_giat.toLocaleString(locale) ?? 0}
                        </td>
                     </tr>
                     <tr>
                        <td>Sub Buka</td>
                        <td className='text-end'>
                           {skpdLokal?.belanja_terbuka.toLocaleString(locale) ?? 0}
                        </td>
                        <td className='text-end'>
                           {sipd?.data?.data?.belanja_terbuka.toLocaleString(locale) ?? 0}
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
            <div className='flex items-center justify-around'>
               <CardData
                  canPres={enabled && access.lokal}
                  hasAccess={access.lokal}
                  results={lokal}
                  key_value='totalCount'
                  title='Lokal'
                  action_title='Lihat'
                  action_path='/perencanaan/rka/skpd'
               />
               <CardData
                  hasAccess={enabled && access.sipd_ri}
                  canPres={access.sync}
                  results={sipd}
                  title='SIPD'
                  action_title='Update'
                  action_path='/sipd-ri/sync/rka/skpd'
               />
            </div>
         </CardBody>
      </Card>
   )
}

export default CardSkpd

'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
// import { getAllBlSubGiatSipd } from '@actions/perencanaan/rka/bl-sub-giat'
import {
   getLaporanRakBlSubGiatSipdPeta,
   getRakSubGiatSipdPeta,
   ParamsRakBlSkpdSipdPeta,
   ResponseLaporanRakBlSubGiatSipdPeta,
} from '@actions/penatausahaan/pengeluaran/rak'
import { getSkpdPenatausahaanFromSipd } from '@actions/penatausahaan/pengeluaran/skpd'
import { validateSipdPetaSession } from '@actions/perencanaan/token-sipd'
import { Autocomplete, AutocompleteItem } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useSession } from '@shared/hooks/use-session'

export default function Page() {
   const { data: session } = useSession(['sipd_peta'])
   const user = useMemo(() => {
      try {
         const { id_daerah, id_skpd, id_unit, id_user, tahun } = validateSipdPetaSession(session)
         return { id_daerah, id_skpd, id_unit, id_user, tahun }
      } catch (error) {
         return {
            id_daerah: 0,
            id_skpd: 0,
            id_unit: 0,
            id_user: 0,
            tahun: 0,
         }
      }
   }, [session])

   const [skpd, setSkpd] = useState<number | string>('')
   const [subGiat, setSubGiat] = useState<ParamsRakBlSkpdSipdPeta & { kode_unik: string }>()

   useEffect(() => {
      user?.id_skpd && setSkpd(user?.id_skpd?.toString() ?? '')
   }, [user?.id_skpd])

   const { data: listSkpd, isFetching: loadingSkpd } = useQuery({
      queryKey: [{ id_daerah: user?.id_daerah, tahun: user?.tahun }, 'skpd_penatausahaan'] as [
         { id_daerah: number; tahun: number },
         ...any,
      ],
      queryFn: ({ queryKey: [q] }) => getSkpdPenatausahaanFromSipd(q),
      enabled: !!user?.id_daerah && !!user?.tahun,
   })

   const { data: listSbl, isFetching: loadingSbl } = useQuery({
      queryKey: [skpd, 'jadwal_penatausahaan'],
      queryFn: async ({ queryKey: [q] }) =>
         await getRakSubGiatSipdPeta(q).then((d) =>
            d.items?.map((i, n) => ({
               ...i,
               kode_unik: n + '.' + i.id_sub_giat,
            }))
         ),
      enabled: !!skpd,
   })
   // const { data: listJadwal, isFetching: loadingJadwal } = useQuery({
   //    queryKey: ['jadwal_penatausahaan', jadwal],
   //    queryFn: () => getJadwaPergeseranDpaFromSipd(),
   //    enabled: !!session,
   // })

   const { data: rak, isFetching: loadingRak } = useQuery({
      queryKey: [subGiat, 'rak_penatausahaan'] as [
         ParamsRakBlSkpdSipdPeta & { kode_unik: string },
         ...any,
      ],
      queryFn: ({ queryKey: [{ kode_unik, ...q }] }) => getLaporanRakBlSubGiatSipdPeta(q),
      enabled: !!subGiat,
   })

   const handleSubGiatSelect = useCallback(
      (key: string | number | null) => {
         const sbl = listSbl?.find((s) => s?.kode_unik === key)
         if (sbl) {
            setSubGiat({
               id_bidang_urusan: sbl?.id_bidang_urusan,
               id_giat: sbl?.id_giat,
               id_program: sbl?.id_program,
               id_sub_giat: sbl?.id_sub_giat,
               id_sub_skpd: sbl?.id_sub_skpd,
               id_unit: sbl?.id_unit,
               id_urusan: sbl?.id_urusan,
               id_skpd: sbl?.id_skpd,
               kode_unik: sbl.kode_unik,
            })
         } else {
            setSubGiat(undefined)
         }
      },
      [listSbl]
   )

   return (
      <div>
         <div className='w-fit border-collapse space-y-6'>
            <Autocomplete
               isInvalid={!skpd}
               isLoading={loadingSkpd}
               label='Pilih SKPD'
               selectedKey={skpd}
               variant='bordered'
               onSelectionChange={(v) => setSkpd(v || '')}
               items={listSkpd || []}>
               {(item) => (
                  <AutocompleteItem
                     startContent={item.kode_skpd}
                     key={item.id_skpd}>
                     {item?.nama_skpd}
                  </AutocompleteItem>
               )}
            </Autocomplete>
            <Autocomplete
               isInvalid={!subGiat}
               isLoading={loadingSbl}
               label='Pilih Sub Kegiatan'
               selectedKey={subGiat?.kode_unik || ''}
               variant='bordered'
               onSelectionChange={handleSubGiatSelect}
               items={listSbl || []}>
               {(item) => (
                  <AutocompleteItem
                     textValue={item?.nama_sub_giat}
                     key={item.kode_unik}>
                     <p>
                        {item?.nama_sub_giat}{' '}
                        <span>
                           {item?.nilai_rak?.toLocaleString('id', {
                              style: 'currency',
                              currency: 'IDR',
                           })}
                        </span>
                     </p>
                     <p className='text-xs italic'>{item?.nama_sub_skpd}</p>
                  </AutocompleteItem>
               )}
            </Autocomplete>
         </div>
         <div>
            <table>
               <tbody>{rak && <RakTable rak={rak} />}</tbody>
            </table>
         </div>
      </div>
   )
}

const RakTable = ({ rak: { items } }: { rak: ResponseLaporanRakBlSubGiatSipdPeta }) => {
   return items
      ?.filter((d) => d?.kode_rekening?.startsWith('5') && d?.kode_rekening?.length === 17)
      ?.map((item, i) => {
         return (
            <tr key={item?.kode_rekening + i}>
               <td className='cell-print'>{item?.kode_rekening}</td>
               <td className='cell-print'>{item?.uraian}</td>
               <td className='cell-print text-right'>
                  {item?.anggaran_tahun_ini?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_1?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_2?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_3?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {(item?.bulan_1 + item?.bulan_2 + item?.bulan_3)?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_4?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_5?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_6?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {(item?.bulan_4 + item?.bulan_5 + item?.bulan_6)?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {(
                     item?.bulan_1 +
                     item?.bulan_2 +
                     item?.bulan_3 +
                     item?.bulan_4 +
                     item?.bulan_5 +
                     item?.bulan_6
                  )?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_7?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_8?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_9?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {(
                     item?.bulan_7 +
                     item?.bulan_8 +
                     item?.bulan_9 +
                     item?.bulan_10 +
                     item?.bulan_11 +
                     item?.bulan_12
                  )?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_10?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_11?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.bulan_12?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {(item?.bulan_10 + item?.bulan_11 + item?.bulan_12)?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {(
                     item?.bulan_7 +
                     item?.bulan_8 +
                     item?.bulan_9 +
                     item?.bulan_10 +
                     item?.bulan_11 +
                     item?.bulan_12
                  )?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print text-right'>
                  {item?.total_rak?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
            </tr>
         )
      })
}

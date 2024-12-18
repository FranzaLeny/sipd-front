'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
// import { getAllBlSubGiatSipd } from '@actions/perencanaan/rka/bl-sub-giat'
import {
   getLaporanRakBlSubGiatSipdPeta,
   getRakSubGiatSipdPeta,
} from '@actions/penatausahaan/sipd/rak'
import { getSkpdPenatausahaanFromSipd } from '@actions/penatausahaan/sipd/skpd'
import { validateSipdPetaSession } from '@actions/perencanaan/token-sipd'
import { Autocomplete, AutocompleteItem } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToRupiah } from '@utils'
import { sumBy } from 'lodash-es'
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
   const [subGiat, setSubGiat] = useState<GetRakBlSubGiatSipdPetaParams & { kode_unik: string }>()

   useEffect(() => {
      console.log({ user: user?.id_skpd })

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

   const { data: rak, isFetching: loadingRak } = useQuery({
      queryKey: [subGiat, 'rak_penatausahaan'] as [
         GetRakBlSubGiatSipdPetaParams & { kode_unik: string },
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
               listboxProps={{ emptyContent: 'Tidak ada data SKPD' }}
               isInvalid={!skpd}
               isLoading={loadingSkpd}
               label='Pilih SKPD'
               selectedKey={skpd}
               variant='bordered'
               onSelectionChange={(v) => setSkpd(v || '')}
               defaultItems={listSkpd || []}>
               {(item) => (
                  <AutocompleteItem
                     startContent={item.kode_skpd}
                     key={item.id_skpd}>
                     {item?.nama_skpd}
                  </AutocompleteItem>
               )}
            </Autocomplete>
            <Autocomplete
               listboxProps={{ emptyContent: 'Tidak ada data Sub Kegiatan' }}
               isInvalid={!subGiat}
               isLoading={loadingSbl}
               label='Pilih Sub Kegiatan'
               selectedKey={subGiat?.kode_unik || ''}
               variant='bordered'
               onSelectionChange={handleSubGiatSelect}
               defaultItems={listSbl || []}>
               {(item) => (
                  <AutocompleteItem
                     textValue={item?.nama_sub_giat}
                     key={item.kode_unik}>
                     <p>
                        {item?.nama_sub_giat} <span>{numberToRupiah(item?.nilai_rak)}</span>
                     </p>
                     <p className='text-xs italic'>{item?.nama_sub_skpd}</p>
                  </AutocompleteItem>
               )}
            </Autocomplete>
         </div>
         <div>
            <table>
               <thead>
                  <tr>
                     <th
                        rowSpan={3}
                        className='cell-print'>
                        Kode Rekening
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print'>
                        Uraian
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print'>
                        Anggaran Tahun Ini
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print'>
                        Total RAK
                     </th>
                     <th
                        colSpan={6}
                        className='cell-print'>
                        Semeser I
                     </th>
                     <th
                        colSpan={6}
                        className='cell-print'>
                        Semester II
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print bg-foreground-100-100 print:hidden'>
                        TW I
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print bg-foreground-100 print:hidden'>
                        TW II
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print bg-foreground-100 print:hidden'>
                        TW III
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print bg-foreground-100 print:hidden'>
                        TW IV
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print bg-foreground-200 print:hidden'>
                        Semeser I
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print bg-foreground-200 print:hidden'>
                        Semester II
                     </th>
                     <th
                        rowSpan={3}
                        className='cell-print bg-foreground-300 print:hidden'>
                        Total
                     </th>
                  </tr>
                  <tr>
                     <th
                        colSpan={3}
                        className='cell-print'>
                        Triwulan I
                     </th>
                     <th
                        colSpan={3}
                        className='cell-print'>
                        Triwulan II
                     </th>
                     <th
                        colSpan={3}
                        className='cell-print'>
                        Triwulan III
                     </th>
                     <th
                        colSpan={3}
                        className='cell-print'>
                        Triwulan IV
                     </th>
                  </tr>
                  <tr>
                     <th className='cell-print'>Januari</th>
                     <th className='cell-print'>Februari</th>
                     <th className='cell-print'>Maret</th>
                     <th className='cell-print'>April</th>
                     <th className='cell-print'>Mei</th>
                     <th className='cell-print'>Juni</th>
                     <th className='cell-print'>Juli</th>
                     <th className='cell-print'>Agustus</th>
                     <th className='cell-print'>September</th>
                     <th className='cell-print'>Oktober</th>
                     <th className='cell-print'>November</th>
                     <th className='cell-print'>Desember</th>
                  </tr>
               </thead>
               <tbody>{rak && <RakTable rak={rak} />}</tbody>
            </table>
         </div>
      </div>
   )
}

const RakTable = ({ rak: { items } }: { rak: LaporanRakBlSubGiatSipdPeta }) => {
   const rincian = items?.filter(
      (d) =>
         d?.kode_rekening?.startsWith('5') &&
         d?.kode_rekening?.length === 17 &&
         d.anggaran_tahun_ini
   )

   return (
      <>
         {rincian
            ?.filter((d) => d?.kode_rekening?.startsWith('5'))
            ?.map((item, i) => {
               const isRinci = item?.kode_rekening?.length === 17
               return (
                  <tr
                     key={item?.kode_rekening + i}
                     className={`${!isRinci && 'font-bold'}`}>
                     <td className='cell-print'>{item?.kode_rekening}</td>
                     <td className='cell-print'>{item?.uraian}</td>
                     <td className='cell-print text-right'>
                        {numberToRupiah(item?.anggaran_tahun_ini)}
                     </td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.total_rak)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_1)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_2)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_3)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_4)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_5)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_6)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_7)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_8)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_9)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_10)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_11)}</td>
                     <td className='cell-print text-right'>{numberToRupiah(item?.bulan_12)}</td>
                     <td className='cell-print bg-foreground/5 text-right font-semibold print:hidden'>
                        {numberToRupiah(item?.bulan_1 + item?.bulan_2 + item?.bulan_3)}
                     </td>
                     <td className='cell-print bg-foreground/5 text-right font-semibold print:hidden'>
                        {numberToRupiah(item?.bulan_4 + item?.bulan_5 + item?.bulan_6)}
                     </td>
                     <td className='cell-print bg-foreground/5 text-right font-semibold print:hidden'>
                        {numberToRupiah(item?.bulan_7 + item?.bulan_8 + item?.bulan_9)}
                     </td>
                     <td className='cell-print  bg-foreground/5 text-right font-semibold print:hidden'>
                        {numberToRupiah(item?.bulan_10 + item?.bulan_11 + item?.bulan_12)}
                     </td>
                     <td className='cell-print  bg-foreground/10 text-right font-bold print:hidden'>
                        {numberToRupiah(
                           item?.bulan_1 +
                              item?.bulan_2 +
                              item?.bulan_3 +
                              item?.bulan_4 +
                              item?.bulan_5 +
                              item?.bulan_6
                        )}
                     </td>
                     <td className='cell-print bg-foreground/10 text-right font-bold print:hidden'>
                        {numberToRupiah(
                           item?.bulan_7 +
                              item?.bulan_8 +
                              item?.bulan_9 +
                              item?.bulan_10 +
                              item?.bulan_11 +
                              item?.bulan_12
                        )}
                     </td>
                     <td className='cell-print bg-foreground/20 text-right font-bold print:hidden'>
                        {numberToRupiah(
                           item?.bulan_1 +
                              item?.bulan_2 +
                              item?.bulan_3 +
                              item?.bulan_4 +
                              item?.bulan_5 +
                              item?.bulan_6 +
                              item?.bulan_7 +
                              item?.bulan_8 +
                              item?.bulan_9 +
                              item?.bulan_10 +
                              item?.bulan_11 +
                              item?.bulan_12
                        )}
                     </td>
                  </tr>
               )
            })}
         <tr className='font-bold'>
            <td
               colSpan={2}
               className='cell-print'>
               JUMLAH ALOKASI KAS YANG TERSEDIA DARI BELANJA PER BULAN
            </td>
            <td className='cell-print text-right'>
               {numberToRupiah(sumBy(rincian, 'anggaran_tahun_ini'))}
            </td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'total_rak'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_1'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_2'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_3'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_4'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_5'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_6'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_7'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_8'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_9'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_10'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_11'))}</td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'bulan_12'))}</td>
            <td colSpan={7}>#</td>
         </tr>
         <tr className='font-bold'>
            <td
               colSpan={2}
               className=''>
               JUMLAH ALOKASI KAS YANG TERSEDIA DARI BELANJA PER TRIWULAN
            </td>
            <td className='cell-print text-right'>
               {numberToRupiah(sumBy(rincian, 'anggaran_tahun_ini'))}
            </td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'total_rak'))}</td>
            <td
               colSpan={3}
               className='cell-print text-right'>
               {numberToRupiah(
                  sumBy(rincian, 'bulan_1') + sumBy(rincian, 'bulan_2') + sumBy(rincian, 'bulan_3')
               )}
            </td>
            <td
               colSpan={3}
               className='cell-print text-right'>
               {numberToRupiah(
                  sumBy(rincian, 'bulan_4') + sumBy(rincian, 'bulan_5') + sumBy(rincian, 'bulan_6')
               )}
            </td>
            <td
               colSpan={3}
               className='cell-print text-right'>
               {numberToRupiah(
                  sumBy(rincian, 'bulan_7') + sumBy(rincian, 'bulan_8') + sumBy(rincian, 'bulan_9')
               )}
            </td>
            <td
               colSpan={3}
               className='cell-print text-right'>
               {numberToRupiah(
                  sumBy(rincian, 'bulan_10') +
                     sumBy(rincian, 'bulan_11') +
                     sumBy(rincian, 'bulan_12')
               )}
            </td>
         </tr>
         <tr className='font-bold'>
            <td
               colSpan={2}
               className=''>
               JUMLAH ALOKASI KAS YANG TERSEDIA DARI BELANJA PER SEMESTE
            </td>
            <td className='cell-print text-right'>
               {numberToRupiah(sumBy(rincian, 'anggaran_tahun_ini'))}
            </td>
            <td className='cell-print text-right'>{numberToRupiah(sumBy(rincian, 'total_rak'))}</td>
            <td
               colSpan={6}
               className='cell-print text-right'>
               {numberToRupiah(
                  sumBy(rincian, 'bulan_1') +
                     sumBy(rincian, 'bulan_2') +
                     sumBy(rincian, 'bulan_3') +
                     sumBy(rincian, 'bulan_4') +
                     sumBy(rincian, 'bulan_5') +
                     sumBy(rincian, 'bulan_6')
               )}
            </td>
            <td
               colSpan={6}
               className='cell-print text-right'>
               {numberToRupiah(
                  sumBy(rincian, 'bulan_7') +
                     sumBy(rincian, 'bulan_8') +
                     sumBy(rincian, 'bulan_9') +
                     sumBy(rincian, 'bulan_10') +
                     sumBy(rincian, 'bulan_11') +
                     sumBy(rincian, 'bulan_12')
               )}
            </td>
         </tr>
      </>
   )
}

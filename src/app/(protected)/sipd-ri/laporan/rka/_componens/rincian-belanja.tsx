'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { getBlSubGiatAktifSipd } from '@actions/perencanaan/rka/bl-sub-giat'
import {
   getLaporanRkaPerubahanListRinciBlSubGiatSipd,
   getLaporanRkaPerubahanSubGiatSipd,
} from '@actions/perencanaan/rka/laporan'
import { TableAnggotaTapd } from '@components/master/tapd'
import TableKepalaSkpd from '@components/perencanaan/table-kepala-skpd'
import Loading from '@components/ui/loading'
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToRupiah, numberToText } from '@utils'
import { keyBy } from 'lodash-es'
import { Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

function TrSubGiat({ label, value }: { label: string; value: string | number }) {
   let text = value?.toString()?.replace(':', '').trim() || '-'
   return (
      <tr className='border-divider break-inside-avoid border first:break-after-avoid print:border-black'>
         <td className='max-w-fit whitespace-nowrap px-1.5'>{label?.trim()}</td>
         <td className='w-5 text-center'>:</td>
         <td className='pr-1.5'>{text?.split('\n').map((x, i) => <p key={i}>{x}</p>)}</td>
      </tr>
   )
}

export default function RingkasanPerubahanRincianBelanjaSubGiat({
   skpd: { skpd, sub_skpd, tapd: dataTapd },
}: {
   skpd: SkpdTapdAnggaranBySkpd
}) {
   const [tapd, setTapd] = useState(dataTapd ?? undefined)
   const [selctedSbl, setSelctedSbl] = useState<BlSubGiatAktifSipd>()
   const { data: slbAktif, isFetching: isFetching } = useQuery({
      queryKey: [
         {
            id_daerah: skpd?.id_daerah,
            tahun: skpd?.tahun,
            id_unit: skpd?.id_unit,
            is_prop: 0,
            is_anggaran: 1,
         },
         'list_sub_giat_aktif_sipd',
      ] as [ListBlSubGiatAktifSipdPayload, string],
      queryFn: ({ queryKey: [q] }) => getBlSubGiatAktifSipd(q),
      enabled: !!skpd,
   })

   const { data: subGait, isFetching: isFetching1 } = useQuery({
      queryKey: [
         {
            id_daerah: selctedSbl?.id_daerah,
            tahun: selctedSbl?.tahun,
            id_sub_bl: selctedSbl?.id_sub_bl,
            id_sub_giat: selctedSbl?.id_sub_giat,
            is_prop: 0,
         },
         'rka_pergeseran_sub_rinci_skpd_sipd',
      ] as [LaporanRkaPerubahanSubGiatSipdPayload, string],
      queryFn: ({ queryKey: [q] }) => getLaporanRkaPerubahanSubGiatSipd(q),
      enabled: !!selctedSbl,
   })

   const { data: laporan, isFetching: isFetching2 } = useQuery({
      queryKey: [
         {
            id_daerah: selctedSbl?.id_daerah,
            tahun: selctedSbl?.tahun,
            id_sub_bl: selctedSbl?.id_sub_bl,
            id_sub_skpd: selctedSbl?.id_sub_skpd,
            id_unit: selctedSbl?.id_unit,
            is_anggaran: 1,
         },
         'rka_pergeseran_rincian_skpd_sipd',
      ] as [LaporanRkaPerubahanListRinciBlSubGiatSipdPayload, string],
      queryFn: ({ queryKey: [q] }) => getLaporanRkaPerubahanListRinciBlSubGiatSipd(q),
      enabled: !!selctedSbl,
   })

   const dataSubGiat = useMemo(() => {
      return !!subGait
         ? keyBy(
              subGait
                 ?.filter((d) => !!d.colom_1.trim())
                 .map((d) => ({
                    ...d,
                    key: d.colom_1?.trim()?.toLowerCase()?.replaceAll(' ', '_'),
                 })),
              'key'
           )
         : {}
   }, [subGait])

   const handleSelected = useCallback(
      (key: any) => {
         const selected = slbAktif?.find((d) => d?.kode_sbl?.toString() === key?.toString())
         setSelctedSbl(selected)
      },
      [slbAktif]
   )

   const printRef = useRef(null)
   const handlePrint = useReactToPrint({
      content: () => printRef.current,
   })
   return (
      <div className='flex h-full max-w-full flex-1 flex-col overflow-hidden'>
         <div className='flex-none print:hidden'>
            <div className='flex items-center gap-2'>
               <div className='bg-primary/20 rounded-medium flex-1 p-2'>
                  <Autocomplete
                     listboxProps={{ emptyContent: 'Tidak ada data Sub Kegiatan' }}
                     variant='faded'
                     color='secondary'
                     isLoading={isFetching}
                     fullWidth
                     placeholder='Cari Sub Kegiatan...'
                     onSelectionChange={handleSelected}
                     aria-labelledby='cari Sub Kegiatan'
                     defaultItems={slbAktif ?? []}>
                     {(item) => (
                        <AutocompleteItem
                           endContent={numberToRupiah(item?.pagu)}
                           key={item.kode_sbl}>
                           {item.nama_sub_giat}
                        </AutocompleteItem>
                     )}
                  </Autocomplete>
               </div>
               <div className='flex-none'>
                  <Button
                     disabled={!laporan}
                     variant='shadow'
                     color='primary'
                     endContent={<Printer className='-mr-2' />}
                     onPress={handlePrint}>
                     Cetak
                  </Button>
               </div>
            </div>
         </div>
         <div className='max-h-full max-w-full flex-1 overflow-auto py-4'>
            {!!slbAktif?.length && !!selctedSbl ? (
               <div
                  className='page-print w-fit min-w-full'
                  ref={printRef}>
                  <table className='min-w-full'>
                     <tbody className='text-center font-bold uppercase'>
                        <tr>
                           <td className='cell-print'>
                              <div className='p-2'>
                                 <p>RANCANGAN DOKUMEN PELAKSANAAN PERUBAHAN ANGGARAN</p>
                                 <p>SATUAN KERJA PERANGKAT DAERAH</p>
                              </div>
                           </td>
                           <td
                              rowSpan={2}
                              className='cell-print'>
                              <div className='p-2'>
                                 <p>FORMULIR</p>
                                 <p>RDPPA-PENDAPATAN</p>
                                 <p>SKPD</p>
                              </div>
                           </td>
                        </tr>
                        <tr>
                           <td className='cell-print '>
                              <p className='p-2'>KABUPATEN LEMBATA TAHUN ANGGARAN {skpd?.tahun}</p>
                           </td>
                        </tr>
                     </tbody>
                  </table>
                  <div className='h-4' />
                  {!!dataSubGiat && !!Object.keys(dataSubGiat)?.length && (
                     <>
                        <table className='min-w-full'>
                           <tbody>
                              <TrSubGiat
                                 label={dataSubGiat['urusan_pemerintahan']?.colom_1}
                                 value={dataSubGiat['urusan_pemerintahan']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['bidang_urusan']?.colom_1}
                                 value={dataSubGiat['bidang_urusan']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['program']?.colom_1}
                                 value={dataSubGiat['program']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['kegiatan']?.colom_1}
                                 value={dataSubGiat['kegiatan']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['organisasi']?.colom_1}
                                 value={dataSubGiat['organisasi']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['unit_organisasi']?.colom_1}
                                 value={dataSubGiat['unit_organisasi']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat[`alokasi_${(skpd?.tahun ?? 0) - 1}`]?.colom_1}
                                 value={numberToRupiah(
                                    dataSubGiat[`alokasi_${(skpd?.tahun ?? 0) - 1}`]?.colom_2
                                 )}
                              />
                              <TrSubGiat
                                 label={dataSubGiat[`alokasi_${skpd?.tahun ?? 0}`]?.colom_1}
                                 value={numberToRupiah(
                                    dataSubGiat[`alokasi_${skpd?.tahun ?? 0}`]?.colom_2
                                 )}
                              />
                              <TrSubGiat
                                 label={dataSubGiat[`alokasi_${(skpd?.tahun ?? 0) + 1}`]?.colom_1}
                                 value={numberToRupiah(
                                    dataSubGiat[`alokasi_${(skpd?.tahun ?? 0) + 1}`]?.colom_2
                                 )}
                              />
                           </tbody>
                        </table>
                        <table className='min-w-full'>
                           <thead className='text-center font-semibold'>
                              <tr>
                                 <th
                                    className='cell-print'
                                    colSpan={6}>
                                    Indikator dan Tolak Ukur Kinerja Kegiatan
                                 </th>
                              </tr>
                              <tr className='font-semibold'>
                                 <th
                                    className='cell-print'
                                    rowSpan={2}>
                                    Indikator
                                 </th>
                                 <th
                                    className='cell-print'
                                    colSpan={2}>
                                    Sebelum
                                 </th>
                                 <th
                                    className='cell-print'
                                    colSpan={2}>
                                    Sesudah
                                 </th>
                              </tr>
                              <tr className='whitespace-nowrap font-semibold'>
                                 <th className='cell-print'>Tolok Ukur Kinerja</th>
                                 <th className='cell-print'>Target Kinerja</th>
                                 <th className='cell-print'>Tolok Ukur Kinerja</th>
                                 <th className='cell-print'>Target Kinerja</th>
                              </tr>
                           </thead>
                           <tbody>
                              <TrIndikator
                                 colom_1={dataSubGiat['capaian_program']?.colom_1}
                                 colom_2={dataSubGiat['capaian_program']?.colom_2}
                                 colom_3={dataSubGiat['capaian_program']?.colom_3}
                                 colom_4={dataSubGiat['capaian_program']?.colom_5}
                                 colom_5={dataSubGiat['capaian_program']?.colom_6}
                              />
                              <TrIndikator
                                 colom_1={dataSubGiat['masukan']?.colom_1}
                                 colom_2={dataSubGiat['masukan']?.colom_2?.replace(':', '').trim()}
                                 colom_3={numberToRupiah(dataSubGiat['masukan']?.colom_3)}
                                 colom_4={dataSubGiat['masukan']?.colom_5}
                                 colom_5={numberToRupiah(dataSubGiat['masukan']?.colom_6)}
                              />

                              <TrIndikator
                                 colom_1={dataSubGiat['keluaran']?.colom_1}
                                 colom_2={dataSubGiat['keluaran']?.colom_2}
                                 colom_3={dataSubGiat['keluaran']?.colom_3}
                                 colom_4={dataSubGiat['keluaran']?.colom_5}
                                 colom_5={dataSubGiat['keluaran']?.colom_6}
                              />
                              <TrIndikator
                                 colom_1={dataSubGiat['hasil']?.colom_1}
                                 colom_2={dataSubGiat['hasil']?.colom_2}
                                 colom_3={dataSubGiat['hasil']?.colom_3}
                                 colom_4={dataSubGiat['hasil']?.colom_5}
                                 colom_5={dataSubGiat['hasil']?.colom_6}
                              />
                           </tbody>
                        </table>
                        <table className='min-w-full'>
                           <tbody>
                              <TrSubGiat
                                 label={dataSubGiat['sub_kegiatan']?.colom_1}
                                 value={dataSubGiat['sub_kegiatan']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['sumber_pendanaan']?.colom_1}
                                 value={dataSubGiat['sumber_pendanaan']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['lokasi']?.colom_1}
                                 value={dataSubGiat['lokasi']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['keluaran_sub_kegiatan']?.colom_1}
                                 value={dataSubGiat['keluaran_sub_kegiatan']?.colom_2}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['waktu_pelaksanaan']?.colom_1}
                                 value={`Mulai ${dataSubGiat['waktu_pelaksanaan']?.colom_2.replace('s.d', 'Sampai')}`}
                              />
                              <TrSubGiat
                                 label={dataSubGiat['keterangan']?.colom_1}
                                 value={dataSubGiat['keterangan']?.colom_2}
                              />
                           </tbody>
                        </table>
                        <div className='h-4' />
                     </>
                  )}
                  {!!laporan && !!laporan?.length && (
                     <table className='min-w-full'>
                        <thead>
                           <tr>
                              <th
                                 className='cell-print'
                                 rowSpan={3}>
                                 Kode Rekening
                              </th>
                              <th
                                 className='cell-print'
                                 rowSpan={3}>
                                 Uraian
                              </th>
                              <th
                                 className='cell-print'
                                 colSpan={10}>
                                 Rincian Perhitungan
                              </th>
                              <th
                                 className='cell-print text-center'
                                 rowSpan={3}>
                                 <div>Bertambah</div>
                                 <div>(Berkurang)</div>
                                 <div>(Rp)</div>
                              </th>
                           </tr>
                           <tr>
                              <th
                                 className='cell-print'
                                 colSpan={5}>
                                 Sebelum
                              </th>
                              <th
                                 className='cell-print'
                                 colSpan={5}>
                                 Sesudah
                              </th>
                           </tr>
                           <tr>
                              <th className='cell-print'>Koefisien</th>
                              <th className='cell-print'>Harga (Rp)</th>
                              <th className='cell-print'>Satuan</th>
                              <th className='cell-print'>PPN</th>
                              <th className='cell-print'>Jumlah (Rp)</th>
                              <th className='cell-print'>Koefisien</th>
                              <th className='cell-print'>Harga (Rp)</th>
                              <th className='cell-print'>Satuan</th>
                              <th className='cell-print'>PPN</th>
                              <th className='cell-print'>Jumlah (Rp)</th>
                           </tr>
                        </thead>
                        <tbody>
                           {laporan?.map((d, i) => {
                              const isRinci = !d?.uraian?.includes('[') && !d.kode_rekening
                              const koefisien_murni = !!d?.koefisien_murni?.trim()
                                 ? d?.koefisien_murni
                                 : undefined
                              const koefisien_geser = !!d?.koefisien_geser?.trim()
                                 ? d?.koefisien_geser
                                 : undefined
                              const uraian = d?.uraian
                                 ?.split('\n')
                                 .map((d, i) => <p key={i}>{d}</p>)
                              const isDeleted =
                                 d?.rincian_murni == 0 && d?.rincian_geser == 0 && d?.selisih == 0
                              return (
                                 !isDeleted && (
                                    <tr
                                       key={`${d?.kode_rekening}-${i}-${selctedSbl?.kode_sbl}`}
                                       className={`${!isRinci && 'font-bold'} break-inside-avoid text-right first:break-before-avoid`}>
                                       <td className='cell-print text-left'>{d?.kode_rekening}</td>
                                       <td
                                          colSpan={isRinci ? 1 : 5}
                                          className={'cell-print text-left '}>
                                          {uraian}
                                       </td>
                                       {isRinci && (
                                          <>
                                             <td className='cell-print text-left'>
                                                {koefisien_murni
                                                   ?.split(' x ')
                                                   ?.map((d) =>
                                                      d
                                                         ?.split(' ')
                                                         ?.map((e, i) =>
                                                            i === 0
                                                               ? e
                                                                    ?.split('.')
                                                                    ?.map((f, j) =>
                                                                       j === 0
                                                                          ? f
                                                                          : f?.substring(0, 2)
                                                                    )
                                                                    ?.join('.')
                                                               : e
                                                         )
                                                         ?.join(' ')
                                                   )
                                                   ?.join(' x ') ?? '-'}
                                             </td>
                                             <td className='cell-print'>
                                                {numberToText(d?.harga_murni, 0, false, '-')}
                                             </td>
                                             <td className='cell-print text-left'>
                                                {!!koefisien_murni ? d?.satuan_murni : '-'}
                                             </td>
                                             <td className='cell-print text-center'>
                                                {!!d?.ppn_murni ? d?.ppn_murni + '%' : '-'}
                                             </td>
                                          </>
                                       )}
                                       <td className='cell-print'>
                                          {numberToText(d?.rincian_murni, 0, false, '-')}
                                       </td>
                                       {isRinci ? (
                                          <>
                                             <td className='cell-print text-left'>
                                                {koefisien_geser
                                                   ?.split(' x ')
                                                   ?.map((d) =>
                                                      d
                                                         ?.split(' ')
                                                         ?.map((e, i) =>
                                                            i === 0
                                                               ? e
                                                                    ?.split('.')
                                                                    ?.map((f, j) =>
                                                                       j === 0
                                                                          ? f
                                                                          : f?.substring(0, 2)
                                                                    )
                                                                    ?.join('.')
                                                               : e
                                                         )
                                                         ?.join(' ')
                                                   )
                                                   ?.join(' x ') ?? '-'}
                                             </td>
                                             <td className='cell-print'>
                                                {!!koefisien_geser
                                                   ? numberToText(d?.harga_geser)
                                                   : '-'}
                                             </td>
                                             <td className='cell-print text-left'>
                                                {!!koefisien_geser ? d?.satuan_geser : '-'}
                                             </td>
                                             <td className='cell-print text-center'>
                                                {!!d?.ppn_geser ? d?.ppn_geser + '%' : '-'}
                                             </td>
                                          </>
                                       ) : (
                                          <td
                                             colSpan={4}
                                             className='cell-print'></td>
                                       )}
                                       <td className='cell-print'>
                                          {numberToText(d?.rincian_geser)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToText(d?.selisih)}
                                       </td>
                                    </tr>
                                 )
                              )
                           })}
                        </tbody>
                     </table>
                  )}
                  <div className='h-4' />
                  <TableKepalaSkpd
                     className='text-medium break-inside-avoid'
                     nama_jabatan_kepala={sub_skpd?.nama_jabatan_kepala}
                     nama_kepala={sub_skpd?.nama_kepala}
                     nip_kepala={sub_skpd?.nip_kepala}
                     pangkat_kepala={sub_skpd?.pangkat_kepala}
                  />
                  <div className='h-4' />
                  <TableAnggotaTapd
                     className='text-lg'
                     values={tapd}
                     onChange={setTapd}
                  />
               </div>
            ) : isFetching || isFetching2 || isFetching1 ? (
               <Loading />
            ) : (
               <p>Pilih Sub Kegiatan terlebih dahulu</p>
            )}
         </div>
      </div>
   )
}

function TrIndikator({
   colom_1,
   colom_2,
   colom_3,
   colom_4,
   colom_5,
}: {
   colom_1: string
   colom_2: string
   colom_3: string
   colom_4: string
   colom_5: string
}) {
   const temp2 = colom_2?.split('\n').map((d) => d.replace(':', '').trim())
   const value2 = temp2?.length >= 1 ? temp2 : ['']
   const temp3 = colom_3?.split('\n').map((d) => d.replace(':', '').trim())
   const value3 = temp3?.length >= 1 ? temp3 : ['']
   const temp4 = colom_4?.split('\n').map((d) => d.replace(':', '').trim())
   const value4 = temp4?.length >= 1 ? temp4 : ['']
   const temp5 = colom_5?.split('\n').map((d) => d.replace(':', '').trim())
   const value5 = temp5?.length >= 1 ? temp5 : ['']
   const maxLength = Math.max(value2?.length, value3?.length, value4?.length)
   const arrayMax = maxLength ? new Array(maxLength - 1).fill('') : []
   return (
      <>
         <tr>
            <td
               rowSpan={maxLength}
               className='cell-print'>
               {colom_1}
            </td>
            <td className='cell-print'>{value2[0]}</td>
            <td className='cell-print'>{value3[0]}</td>
            <td className='cell-print'>{value4[0]}</td>
            <td className='cell-print'>{value5[0]}</td>
         </tr>
         {maxLength > 1
            ? arrayMax.map((_, i) => (
                 <tr key={i + value2[i + 1]}>
                    <td className='cell-print'>{value2[i + 1]}</td>
                    <td className='cell-print'>{value3[i + 1]}</td>
                    <td className='cell-print'>{value4[i + 1]}</td>
                    <td className='cell-print'>{value5[i + 1]}</td>
                 </tr>
              ))
            : null}
      </>
   )
}

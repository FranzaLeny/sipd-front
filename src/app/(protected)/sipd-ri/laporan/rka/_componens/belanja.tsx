'use client'

import { Fragment, useRef, useState } from 'react'
import { getRkaBlPergeseranSubGiatSipd } from '@actions/perencanaan/rka/laporan'
import { TableAnggotaTapd } from '@components/master/tapd'
import TableKepalaSkpd from '@components/perencanaan/table-kepala-skpd'
import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToRupiah } from '@utils'
import { groupBy } from 'lodash-es'
import { Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

export default function RkaPergeseranBelanjaSkpd({
   skpd: { skpd, sub_skpd, tapd: dataTapd },
}: {
   skpd: SkpdTapdAnggaranBySkpd
}) {
   const [tapd, setTapd] = useState(dataTapd ?? undefined)
   const printRef = useRef(null)

   const { data: laporan } = useQuery({
      queryKey: [
         {
            id_daerah: skpd?.id_daerah,
            id_skpd: skpd?.id_skpd,
            id_sub_skpd: sub_skpd?.id_unit,
            tahun: skpd?.tahun,
         },
         'rka_pergeseran_belanja_skpd_sipd',
      ] as [RkaPergeseranSkpdSipdPayload, string],
      queryFn: ({ queryKey: [q] }) => getRkaBlPergeseranSubGiatSipd(q),
      enabled: !!skpd,
   })

   const selisihSum = (laporan?.summary?.sum_total_murni ?? 0) - (laporan?.summary?.sum_total || 0)

   const handlePrint = useReactToPrint({
      content: () => printRef.current,
   })
   const itemsLaporan = groupBy(laporan?.data, 'kode_sub_skpd')
   return (
      <div className='max-h-ful flex max-w-full flex-col overflow-hidden'>
         <div className='flex flex-none justify-end pb-2 print:hidden'>
            <Button
               disabled={!laporan}
               variant='shadow'
               color='primary'
               endContent={<Printer className='-mr-2' />}
               onPress={handlePrint}>
               Cetak
            </Button>
         </div>
         <div className='max-h-full max-w-full flex-1 overflow-auto pb-10'>
            <div
               ref={printRef}
               className='w-fit min-w-full print:bg-white print:text-black'>
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
                              <p>DPPA-PENDAPATAN</p>
                              <p>SKPD</p>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td className='cell-print '>
                           <p className='p-2'>KABUPATEN LEMBATA TAHUN ANGGARAN {sub_skpd?.tahun}</p>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <table className='min-w-full font-bold'>
                  <tbody>
                     <tr className='border-print'>
                        <td className='p-1.5'>Nomor</td>
                        <td className='p-1.5'>:</td>
                        <td className='p-1.5'>
                           RDPPA/A.1/{sub_skpd?.kode_skpd}/......./{skpd?.tahun}
                        </td>
                     </tr>
                     <tr className='border-print'>
                        <td className='p-1.5'>SKPD</td>
                        <td className='p-1.5'>:</td>
                        <td className='p-1.5'>
                           {sub_skpd?.kode_skpd} {sub_skpd?.nama_skpd}
                        </td>
                     </tr>
                     <tr className='border-print'>
                        <td
                           colSpan={3}
                           className='p-4 text-center font-normal'>
                           <p>
                              Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program,
                              Kegiatan, dan Sub Kegiatan
                           </p>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <table className='min-w-full text-sm'>
                  <thead>
                     <tr>
                        <th
                           rowSpan={4}
                           className='cell-print text-vertical'>
                           Urusan
                        </th>
                        <th
                           rowSpan={4}
                           className='cell-print text-vertical'>
                           Bidang Urusan
                        </th>
                        <th
                           rowSpan={4}
                           className='cell-print text-vertical'>
                           Program
                        </th>
                        <th
                           rowSpan={4}
                           className='cell-print text-vertical'>
                           Kegiatan
                        </th>
                        <th
                           rowSpan={4}
                           className='cell-print text-vertical'>
                           Sub Kegiatan
                        </th>
                        <th
                           rowSpan={4}
                           className='cell-print'>
                           Uraian
                        </th>
                        <th
                           rowSpan={4}
                           className='cell-print'>
                           Sumber Dana
                        </th>
                        <th
                           rowSpan={4}
                           className='cell-print'>
                           Lokasi
                        </th>
                        <th
                           colSpan={13}
                           className='cell-print'>
                           JUMLAH
                        </th>
                     </tr>
                     <tr>
                        <th
                           rowSpan={3}
                           className='cell-print whitespace-pre-wrap'>
                           Tahun {(skpd?.tahun ?? 0) - 1}
                        </th>
                        <th
                           colSpan={11}
                           className='cell-print'>
                           Tahun {skpd?.tahun ?? 0}
                        </th>
                        <th
                           rowSpan={3}
                           className='cell-print'>
                           Tahun{(skpd?.tahun ?? 0) + 1}
                        </th>
                     </tr>
                     <tr>
                        <th
                           colSpan={5}
                           className='cell-print'>
                           Sebelum
                        </th>
                        <th
                           colSpan={5}
                           className='cell-print'>
                           Sesudah
                        </th>
                        <th
                           rowSpan={2}
                           className='cell-print'>
                           <div>Bertambah</div>
                           <div>(Berkurang)</div>
                        </th>
                     </tr>
                     <tr className='font-bold '>
                        <th className='cell-print'>Belanja Operasi</th>
                        <th className='cell-print'>Belanja Modal</th>
                        <th className='cell-print'>Belanja Tak Terduga</th>
                        <th className='cell-print'>Belanja Transfer</th>
                        <th className='cell-print'>Jumlah</th>
                        <th className='cell-print'>Belanja Operasi</th>
                        <th className='cell-print'>Belanja Modal</th>
                        <th className='cell-print'>Belanja Tak Terduga</th>
                        <th className='cell-print'>Belanja Transfer</th>
                        <th className='cell-print'>Jumlah</th>
                     </tr>
                  </thead>
                  <tbody>
                     {Object.entries(itemsLaporan)?.map(([key, items]) => {
                        const sub = items[0]
                        const selisihSub = (sub?.total_murni || 0) - (sub?.total_geser || 0)
                        return (
                           <Fragment>
                              <tr className='bg-content1 text-right font-bold'>
                                 <td
                                    colSpan={8}
                                    className='cell-print text-left'>
                                    {key} {sub?.nama_sub_skpd}
                                 </td>
                                 <td className='cell-print'>{numberToRupiah(sub?.pagu_n_lalu)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.bo_murni)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.bm_murni)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.btt_murni)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.bt_murni)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.total_murni)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.bo_geser)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.bm_geser)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.btt_geser)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.bt_geser)}</td>
                                 <td className='cell-print'>{numberToRupiah(sub?.total_geser)}</td>
                                 {selisihSub < 0 ? (
                                    <td className='cell-print text-right text-red-800'>
                                       (<span>{numberToRupiah(-selisihSub)}</span>)
                                    </td>
                                 ) : (
                                    <td className='cell-print text-right'>
                                       {numberToRupiah(selisihSub)}
                                    </td>
                                 )}
                                 <td className='cell-print'>{numberToRupiah(sub?.pagu_n_depan)}</td>
                              </tr>
                              {items?.map((item) => {
                                 const selisih = (item?.total_geser ?? 0) - (item?.total_murni || 0)
                                 const kode = item?.kode.split('.')
                                 const isNull = !(!!item?.total_geser && !!item?.total_murni)
                                 return (
                                    <tr
                                       key={item?.kode}
                                       className={`break-inside-avoid ${!item?.lokasi ? 'font-bold' : ''} ${isNull ? 'hidden' : ''}`}>
                                       <td className='cell-print text-center'>{kode[0]}</td>
                                       <td className='cell-print text-center'>{kode[1]}</td>
                                       <td className='cell-print text-center'>{kode[2]}</td>
                                       <td className='cell-print text-center'>
                                          {kode.slice(3, 5).join('.')}
                                       </td>
                                       <td className='cell-print text-center'>{kode[5]}</td>
                                       <td
                                          colSpan={!item?.lokasi ? 3 : 1}
                                          className='cell-print'>
                                          {item.uraian}
                                       </td>
                                       {item?.lokasi && (
                                          <>
                                             <td className='cell-print'>
                                                {item?.sumber_dana
                                                   ?.split('-')
                                                   ?.map((v) => <div>{v}</div>)}
                                             </td>
                                             <td className='cell-print'>
                                                {item?.lokasi
                                                   ?.split('-')
                                                   ?.map((v) => <div>{v}</div>)}
                                             </td>
                                          </>
                                       )}
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item?.pagu_n_lalu)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item?.bo_murni)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item?.bm_murni)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item?.btt_murni)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item.bt_murni)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item?.total_murni)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item.bo_geser)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item.bm_geser)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item?.btt_geser)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item.bt_geser)}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item?.total_geser)}
                                       </td>
                                       {selisih < 0 ? (
                                          <td className='cell-print text-right text-red-800 print:text-red-800'>
                                             (<span>{numberToRupiah(-selisih)}</span>)
                                          </td>
                                       ) : (
                                          <td className='cell-print text-right'>
                                             {numberToRupiah(selisih)}
                                          </td>
                                       )}
                                       <td className='cell-print text-right'>
                                          {numberToRupiah(item.pagu_n_depan)}
                                       </td>
                                    </tr>
                                 )
                              })}
                           </Fragment>
                        )
                     })}
                     <tr className='bg-content1 text-right font-bold'>
                        <td
                           colSpan={8}
                           className='cell-print text-right'>
                           Jumlah
                        </td>

                        <td className='cell-print'>
                           {numberToRupiah(laporan?.summary?.sum_pagu_n_lalu)}
                        </td>
                        <td className='cell-print'>
                           {numberToRupiah(laporan?.summary?.sum_bo_murni)}
                        </td>
                        <td className='cell-print'>
                           {numberToRupiah(laporan?.summary?.sum_bm_murni)}
                        </td>
                        <td className='cell-print'>
                           {numberToRupiah(laporan?.summary?.sum_btt_murni)}
                        </td>
                        <td className='cell-print'>
                           {numberToRupiah(laporan?.summary?.sum_bt_murni)}
                        </td>
                        <td className='cell-print'>
                           {numberToRupiah(laporan?.summary?.sum_total_murni)}
                        </td>
                        <td className='cell-print'>{numberToRupiah(laporan?.summary?.sum_bo)}</td>
                        <td className='cell-print'>{numberToRupiah(laporan?.summary?.sum_bm)}</td>
                        <td className='cell-print'>{numberToRupiah(laporan?.summary?.sum_btt)}</td>
                        <td className='cell-print'>{numberToRupiah(laporan?.summary?.sum_bt)}</td>
                        <td className='cell-print'>
                           {numberToRupiah(laporan?.summary?.sum_total)}
                        </td>
                        {selisihSum < 0 ? (
                           <td className='cell-print text-right text-red-800'>
                              (<span>{numberToRupiah(-selisihSum)}</span>)
                           </td>
                        ) : (
                           <td className='cell-print text-right'>{numberToRupiah(selisihSum)}</td>
                        )}
                        <td className='cell-print'>
                           {numberToRupiah(laporan?.summary?.sum_pagu_n_depan)}
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div className='h-4' />
               <TableKepalaSkpd
                  className='text-medium'
                  nama_jabatan_kepala={skpd?.nama_jabatan_kepala}
                  nama_kepala={skpd?.nama_kepala}
                  nip_kepala={skpd?.nip_kepala}
                  pangkat_kepala={skpd?.pangkat_kepala}
               />
               <div className='h-4' />
               <TableAnggotaTapd
                  className='text-medium'
                  values={tapd}
                  onChange={setTapd}
               />
            </div>
         </div>
      </div>
   )
}

'use client'

import { useRef, useState } from 'react'
import { ResponseSkpdTapdAnggaranBySkpd } from '@actions/perencanaan/data/skpd'
import { getRkaPendapatanPergeseranSkpdSipd } from '@actions/perencanaan/rka/laporan'
import { TableAnggotaTapd } from '@components/master/tapd'
import TableKepalaSkpd from '@components/perencanaan/table-kepala-skpd'
import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

export default function RingkasanPerubahanPendapatanSkpd({
   skpd: { skpd, sub_skpd, tapd: dataTapd },
}: {
   skpd: ResponseSkpdTapdAnggaranBySkpd
}) {
   const [tapd, setTapd] = useState(dataTapd ?? undefined)
   const { data: laporan } = useQuery({
      queryKey: [
         {
            id_daerah: skpd?.id_daerah,
            id_skpd: skpd?.id_skpd,
            id_sub_skpd: sub_skpd?.id_skpd,
            tahun: skpd?.tahun,
         },
         'rka_pergeseran_pendapatan_skpd_sipd',
      ] as [RkaPergeseranSkpdSipdPayload, string],
      queryFn: ({ queryKey: [q] }) => getRkaPendapatanPergeseranSkpdSipd(q),
      enabled: !!skpd && !!sub_skpd,
   })
   const printRef = useRef(null)
   const sum = laporan?.data[0]
   const handlePrint = useReactToPrint({
      content: () => printRef.current,
   })
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
         <div className='h-fit max-h-full max-w-full flex-1 overflow-auto pb-10'>
            <div
               className='w-fit min-w-full print:bg-white print:text-black'
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
                           RDPPA/A.1/{sub_skpd?.kode_skpd}/......./{sub_skpd?.tahun}
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
                              Ringkasan Dokumen Pelaksanaan Anggaran Pendapatan dan Belanja Daerah
                           </p>
                           <p>Satuan Kerja Perangkat Daerah</p>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <table className='min-w-full'>
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
                           colSpan={4}
                           className='cell-print'>
                           Sebelum
                        </th>
                        <th
                           colSpan={4}
                           className='cell-print'>
                           Sesudah
                        </th>
                        <th
                           rowSpan={3}
                           className='cell-print'>
                           Bertambah (Berkurang) (Rp)
                        </th>
                     </tr>
                     <tr>
                        <th
                           colSpan={3}
                           className='cell-print'>
                           Rincian
                        </th>
                        <th
                           rowSpan={2}
                           className='cell-print'>
                           Jumlah
                        </th>
                        <th
                           colSpan={3}
                           className='cell-print'>
                           Rincian
                        </th>
                        <th
                           rowSpan={2}
                           className='cell-print'>
                           Jumlah
                        </th>
                     </tr>
                     <tr>
                        <th className='cell-print'>Volume</th>
                        <th className='cell-print'>Satuan</th>
                        <th className='cell-print'>Tarif / Harga</th>
                        <th className='cell-print'>Volume</th>
                        <th className='cell-print'>Satuan</th>
                        <th className='cell-print'>Tarif / Harga</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className='text-right font-bold'>
                        <td className='cell-print bg-content2 text-left '>{sub_skpd?.kode_skpd}</td>
                        <td
                           colSpan={4}
                           className='cell-print text-left'>
                           {sub_skpd?.nama_skpd}
                        </td>
                        <td className='cell-print'>
                           {sum?.nilai_sebelum?.toLocaleString('id-ID', {
                              maximumFractionDigits: 0,
                              style: 'currency',
                              currency: 'IDR',
                           })}
                        </td>
                        <td colSpan={3} />
                        <td className='cell-print'>
                           {sum?.nilai_sesudah?.toLocaleString('id-ID', {
                              maximumFractionDigits: 0,
                              style: 'currency',
                              currency: 'IDR',
                           })}
                        </td>
                        <td className='cell-print'>
                           {((sum?.nilai_sesudah || 0) - (sum?.nilai_sebelum || 0))?.toLocaleString(
                              'id-ID',
                              {
                                 maximumFractionDigits: 0,
                                 style: 'currency',
                                 currency: 'IDR',
                              }
                           )}
                        </td>
                     </tr>
                     {laporan?.data?.map((d) => {
                        const hasKeterangan = !!d?.keterangan
                        return (
                           <>
                              <tr
                                 key={d?.kode_akun}
                                 className='font-bold'>
                                 <td className='cell-print'>{d?.kode_akun}</td>
                                 <td
                                    colSpan={4}
                                    className='cell-print'>
                                    {d?.nama_akun}
                                 </td>
                                 <td className='cell-print text-right'>
                                    {d?.nilai_sebelum?.toLocaleString('id-ID', {
                                       maximumFractionDigits: 0,
                                       style: 'currency',
                                       currency: 'IDR',
                                    })}
                                 </td>
                                 <td
                                    colSpan={3}
                                    className='cell-print'
                                 />
                                 <td className='cell-print text-right'>
                                    {d?.nilai_sesudah?.toLocaleString('id-ID', {
                                       maximumFractionDigits: 0,
                                       style: 'currency',
                                       currency: 'IDR',
                                    })}
                                 </td>
                                 <td className='cell-print text-right'>
                                    {d?.selisih?.toLocaleString('id-ID', {
                                       maximumFractionDigits: 0,
                                       style: 'currency',
                                       currency: 'IDR',
                                    })}
                                 </td>
                              </tr>
                              {hasKeterangan && (
                                 <>
                                    <tr
                                       key={d?.kode_akun + d.keterangan}
                                       className='font-bold'>
                                       <td className='cell-print'></td>
                                       <td
                                          colSpan={4}
                                          className='cell-print'>
                                          :: {d?.keterangan}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {d?.nilai_sebelum?.toLocaleString('id-ID', {
                                             maximumFractionDigits: 0,
                                             style: 'currency',
                                             currency: 'IDR',
                                          })}
                                       </td>
                                       <td
                                          colSpan={3}
                                          className='cell-print'
                                       />
                                       <td className='cell-print text-right'>
                                          {d?.nilai_sesudah?.toLocaleString('id-ID', {
                                             maximumFractionDigits: 0,
                                             style: 'currency',
                                             currency: 'IDR',
                                          })}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {d?.selisih?.toLocaleString('id-ID', {
                                             maximumFractionDigits: 0,
                                             style: 'currency',
                                             currency: 'IDR',
                                          })}
                                       </td>
                                    </tr>
                                    <tr key={d?.kode_akun + d.keterangan + 'detail'}>
                                       <td className='cell-print'></td>
                                       <td className='cell-print'>{d?.nama_akun}</td>
                                       <td className='cell-print'>{d?.koefisien}</td>
                                       <td className='cell-print'>{d?.satuan}</td>
                                       <td className='cell-print text-right'>
                                          {d?.nilai_sebelum?.toLocaleString('id-ID', {
                                             maximumFractionDigits: 0,
                                             style: 'currency',
                                             currency: 'IDR',
                                          })}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {d?.nilai_sebelum?.toLocaleString('id-ID', {
                                             maximumFractionDigits: 0,
                                             style: 'currency',
                                             currency: 'IDR',
                                          })}
                                       </td>
                                       <td className='cell-print'>{d?.koefisien}</td>
                                       <td className='cell-print'>{d?.satuan}</td>
                                       <td className='cell-print text-right'>
                                          {d?.nilai_sesudah?.toLocaleString('id-ID', {
                                             maximumFractionDigits: 0,
                                             style: 'currency',
                                             currency: 'IDR',
                                          })}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {d?.nilai_sesudah?.toLocaleString('id-ID', {
                                             maximumFractionDigits: 0,
                                             style: 'currency',
                                             currency: 'IDR',
                                          })}
                                       </td>
                                       <td className='cell-print text-right'>
                                          {d?.selisih?.toLocaleString('id-ID', {
                                             maximumFractionDigits: 0,
                                             style: 'currency',
                                             currency: 'IDR',
                                          })}
                                       </td>
                                    </tr>
                                 </>
                              )}
                           </>
                        )
                     })}
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

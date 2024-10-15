'use client'

import { useRef, useState } from 'react'
import { getLaporanRkaPerubahanSkpdSipd } from '@actions/perencanaan/rka/laporan'
import { TableAnggotaTapd } from '@components/master/tapd'
import TableKepalaSkpd from '@components/perencanaan/table-kepala-skpd'
import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToRupiah } from '@utils'
import { Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

export default function RingkasanPerubahanSkpd({
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
         'laporan_rka_skpd_sipd',
      ] as [LaporanRkaPerubahanSkpdSipdPayload, string],
      queryFn: ({ queryKey: [q] }) => getLaporanRkaPerubahanSkpdSipd(q),
      enabled: !!skpd && !!sub_skpd,
   })

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
         <div className='max-h-full max-w-full flex-1 overflow-auto pb-4'>
            <div
               ref={printRef}
               className='w-fit min-w-full'>
               <table className='min-w-full'>
                  <tbody className='page-print text-center font-bold uppercase'>
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
                              <p>RDPPA</p>
                              <p>REKAPITULASI</p>
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
               <table className='min-w-full font-bold'>
                  <tbody>
                     <tr className='border-print'>
                        <td className='p-1.5'>Nomor</td>
                        <td className='p-1.5'>:</td>
                        <td className='p-1.5'>
                           RDPPA/A.1/{skpd?.kode_skpd}/......./{skpd?.tahun}
                        </td>
                     </tr>
                     <tr className='border-print'>
                        <td className='p-1.5'>SKPD</td>
                        <td className='p-1.5'>:</td>
                        <td className='p-1.5'>
                           {skpd?.kode_skpd} {skpd?.nama_skpd}
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
                           rowSpan={2}
                           className='cell-print'>
                           Kode Rekening
                        </th>
                        <th
                           rowSpan={2}
                           className='cell-print'>
                           Uraian
                        </th>
                        <th
                           colSpan={2}
                           className='cell-print'>
                           Jumlah (Rp)
                        </th>
                        <th
                           rowSpan={2}
                           className='cell-print'>
                           <div>Bertambah</div>
                           <div>(Berkurang)</div>
                        </th>
                     </tr>
                     <tr>
                        <th className='cell-print'>Sebelum</th>
                        <th className='cell-print'>Sesudah</th>
                     </tr>
                  </thead>
                  <tbody>
                     {laporan?.map((d) => {
                        return (
                           <tr
                              key={d?.kode_akun}
                              className={`${d.kode_akun?.length < 6 ? 'font-bold' : ''}`}>
                              <td className='cell-print'>{d?.kode_akun}</td>
                              <td className='cell-print'>{d?.nama_akun}</td>
                              <td className='cell-print text-right'>
                                 {numberToRupiah(d?.nilai_sebelum)}
                              </td>
                              <td className='cell-print text-right'>
                                 {numberToRupiah(d?.nilai_sesudah)}
                              </td>
                              <td className='cell-print text-right'>
                                 {numberToRupiah(d?.selisih)}
                              </td>
                           </tr>
                        )
                     })}
                  </tbody>
               </table>
               <div className='h-4' />
               <TableKepalaSkpd
                  className='text-medium'
                  nama_jabatan_kepala={sub_skpd?.nama_jabatan_kepala}
                  nama_kepala={sub_skpd?.nama_kepala}
                  nip_kepala={sub_skpd?.nip_kepala}
                  pangkat_kepala={sub_skpd?.pangkat_kepala}
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

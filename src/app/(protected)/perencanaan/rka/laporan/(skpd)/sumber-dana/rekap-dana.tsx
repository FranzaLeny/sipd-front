'use client'

import { useMemo, useRef } from 'react'
import Image from 'next/image'
import { getDaerah } from '@actions/data/lokasi'
import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToRupiah } from '@utils'
import { ArrowLeftCircle, Download, Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { RekapanSumberDana } from '@/types/api/laporan'

import dowloadDanaExcel from './excel-murni'

interface Props {
   sumberDana: RekapanSumberDana['sumber_dana']
   skpd: RekapanSumberDana['skpd']['unit']
   tahun: number
   jadwal: string
}

export default function RekapDana({ sumberDana, tahun, skpd, jadwal }: Props) {
   const printRef = useRef(null)

   const { data: daerah } = useQuery({
      queryKey: [
         { id_daerah: skpd?.id_daerah, is_prop: !!skpd?.is_prop },
         'data_provinsi',
         'data_kab_kota',
      ],
      queryFn: async () =>
         await getDaerah({ id_daerah: skpd?.id_daerah, is_prop: !!skpd?.is_prop }),
      enabled: !!skpd?.id_daerah,
   })

   const documentTitle = useMemo(() => {
      let text = `Rekapan Sumber Dana ${skpd?.singkatan_skpd ?? skpd?.kode_skpd} ${tahun} ${jadwal}`
         .substring(0, 150)
         .replace(/[<>:"/\\|?*\x00-\x1F]/, '_')
      return text
   }, [skpd, jadwal, tahun])

   const handlePrint = useReactToPrint({
      content: () => printRef.current,
      documentTitle,
   })

   const back = () => {}
   const handleExportExcel = async () => {
      await dowloadDanaExcel({ documentTitle, skpd, sumberDana, tahun })
   }
   return (
      <>
         <div className='content size-fit min-w-full max-w-full pb-10 pt-2'>
            <div className='top-navbar  sticky left-1/2 z-10 flex w-fit -translate-x-1/2 gap-4 rounded-b-3xl py-2 backdrop-blur'>
               <Button
                  color='danger'
                  className='sm:rounded-medium min-w-10 rounded-full px-2 backdrop-blur-sm sm:min-w-20'
                  onPress={back}>
                  <ArrowLeftCircle className='size-5' />
                  <span className='hidden sm:inline-flex'>Kembali</span>
               </Button>

               <Button
                  color='success'
                  className='sm:rounded-medium min-w-10 rounded-full px-2 backdrop-blur-sm sm:min-w-20'
                  endContent={<Printer className='size-5' />}
                  onPress={handlePrint}>
                  <span className='hidden sm:inline-flex'>Cetak</span>
               </Button>
               <Button
                  color='primary'
                  className='sm:rounded-medium min-w-10 rounded-full px-2 backdrop-blur-sm sm:min-w-20'
                  endContent={<Download className='size-5' />}
                  onPress={handleExportExcel}>
                  <span className='hidden sm:inline-flex'>Excel</span>
               </Button>
            </div>
            <div
               ref={printRef}
               className='bg-content1 rounded-medium size-fit min-w-full max-w-max p-2 text-sm shadow sm:p-4 print:bg-white print:p-0 print:text-xs print:text-black'>
               <table className='min-w-full'>
                  <tbody className='text-center font-bold uppercase'>
                     <tr className='border-b-4 border-double print:border-black'>
                        <td className='w-[2cm] p-2'>
                           {/* <div className='w-11'> */}
                           <Image
                              src='/images/logo_kab_lembata.png'
                              alt='logo'
                              width={100}
                              height={100}
                           />
                           {/* </div> */}
                        </td>
                        <td>
                           <div className='p-2'>
                              <p>PEMERINTAH {daerah?.nama_daerah?.replace('Kab.', 'Kabupaten')}</p>
                              <p>{skpd?.nama_skpd}</p>
                              <p>TAHUN ANGGARAN {tahun}</p>
                           </div>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <p className='p-3 text-center font-bold underline'>REKAPAN SUMBER DANA</p>
               <table className='min-w-full text-sm'>
                  <thead>
                     <tr>
                        <th
                           className='cell-print'
                           rowSpan={2}>
                           Kode
                        </th>
                        <th
                           className='cell-print'
                           rowSpan={2}>
                           Uraian
                        </th>
                        <th
                           className='cell-print'
                           rowSpan={2}>
                           Pagu
                        </th>
                        <th
                           className='cell-print'
                           colSpan={sumberDana[0]?.belanja?.length ?? 1}>
                           Sumber Dana
                        </th>
                        <th
                           className='cell-print'
                           rowSpan={2}>
                           Total
                        </th>
                        <th
                           className='cell-print print:hidden'
                           rowSpan={2}>
                           Keterangan
                        </th>
                     </tr>
                     <tr>
                        {sumberDana[0]?.belanja.map((item) => {
                           return (
                              <th
                                 key={item.id_dana}
                                 className='cell-print'>
                                 {item.nama_dana}
                              </th>
                           )
                        })}
                     </tr>
                  </thead>
                  <tbody>
                     {sumberDana?.map((item) => {
                        const isAkun = item?.group === 'akun'
                        const isJumlah = item?.group === 'jumlah' || item.group === 'sub_skpd'
                        const isMatch = item.total_harga === item.pagu
                        return (
                           <tr
                              key={item.no_urut}
                              className={`${!isAkun && 'font-bold'} `}>
                              {!isJumlah && <td className='cell-print'>{item.kode}</td>}
                              <td
                                 className='cell-print'
                                 colSpan={isJumlah ? 2 : 1}>
                                 {item?.group === 'sub_skpd'
                                    ? `${item.kode} ${item.uraian}`
                                    : item.uraian}
                              </td>
                              <td className='cell-print text-right'>{numberToRupiah(item.pagu)}</td>
                              {item.belanja?.map((bl) => {
                                 const isMatch = bl.total_harga === bl.pagu
                                 return (
                                    <td
                                       className='cell-print text-right'
                                       key={item.kode + bl.id_dana}>
                                       {!isMatch && !isAkun && (
                                          <div className='text-danger print:hidden '>
                                             Pagu: {numberToRupiah(bl.pagu)}
                                          </div>
                                       )}
                                       {numberToRupiah(bl.total_harga)}
                                    </td>
                                 )
                              })}
                              <td className='cell-print text-right'>
                                 {numberToRupiah(item?.total_harga)}
                              </td>
                              <td className='cell-print text-center print:hidden'>
                                 {isMatch ? (
                                    'OK'
                                 ) : (
                                    <div className='text-danger'>
                                       Selisih {numberToRupiah(item?.total_harga - item?.pagu)}
                                    </div>
                                 )}
                              </td>
                           </tr>
                        )
                     })}
                  </tbody>
               </table>
               <div className='h-2' />
               {/* <TableKepalaSkpd
            className='print:text-[15pt]'
            classNameSpace='h-16'
            nama_jabatan_kepala={skpd?.nama_jabatan_kepala}
            nama_kepala={skpd?.nama_kepala}
            nip_kepala={skpd?.nip_kepala}
            pangkat_kepala={skpd?.pangkat_kepala}
         />
          */}
            </div>
         </div>
      </>
   )
}

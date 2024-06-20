'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TableAnggotaTapd } from '@components/master/tapd'
import TableCatatanRka from '@components/perencanaan/table-catatan-rka'
import TableKepalaSkpd from '@components/perencanaan/table-kepala-skpd'
import {
   Button,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger,
   Selection,
} from '@nextui-org/react'
import { ArrowBigLeft, Printer, Settings } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import type { LaporanPendapatan } from '@/types/api/laporan'

import { RowMurni, RowPerubahan, TheadMurni, TheadPerubahan } from './components'

const LIST_DOKUMEN = [
   {
      key: 'rka',
      name: 'RKA',
      title: 'Rencana Kerja dan Anggaran',
      kode: 'RKA',
      header: 'Rincian Anggaran Pendapatan',
      type: 'murni',
   },
   {
      key: 'rkpa',
      name: 'RKA Perubahan',
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
      header: 'Rincian Perubahan Anggaran Pendapatan',
      type: 'perubahan',
   },
   {
      key: 'RDPA',
      name: 'RDPA',
      title: 'Rancangan Dokumen Pelaksanaan Anggaran',
      kode: 'RDPA',
      header: 'Ringkasan Dokumen Perubahan Pelaksanaan Anggaran Pendapatan dan Belanja Daerah',
      type: 'murni',
   },
   {
      key: 'rdppa',
      name: 'RDPPA',
      title: 'Rancangan Dokumen Perubahan Pelaksanaan Anggaran',
      kode: 'RDPPA',
      header: 'Ringkasan Dokumen Perubahan Pelaksanaan Anggaran Pendapatan dan Belanja Daerah',
      type: 'perubahan',
   },
]

export default function RkaPendapatan({
   tahun,
   anggotaTapd,
   jadwalTipe,
   listPendapatan = [],
   unit,
   skpd,
}: {
   jadwalTipe: 'perubahan' | 'murni'
   skpd: LaporanPendapatan['skpd']['sub_skpd']
   unit: LaporanPendapatan['skpd']['unit']
   anggotaTapd: LaporanPendapatan['skpd']['tapd']
   listPendapatan: LaporanPendapatan['list_pendapatan']
   tahun: number
}) {
   const [selectedDok, setSelectedDok] = useState<Selection>(
      new Set(jadwalTipe === 'murni' ? ['rka'] : 'RKPA')
   )
   const [tapd, setTapd] = useState(anggotaTapd)
   const router = useRouter()
   const printRef = useRef(null)

   const jenisDok = useMemo(() => {
      const key = Array.from(selectedDok)[0]
      if (key) {
         return LIST_DOKUMEN.find((item) => item.key === key)
      }
      return LIST_DOKUMEN[0]
   }, [selectedDok])

   const documentTitle = useMemo(() => {
      let text = 'RKA_04_PENDAPATAN'
      if (!!skpd && jenisDok) {
         text =
            (jenisDok.kode + '_' + skpd?.kode_skpd?.substring(0, 6) + '_' + skpd?.nama_skpd)
               ?.substring(0, 120)
               ?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '_04_PENDAPATAN'
      }
      return text
   }, [skpd, jenisDok])

   const handlePrint = useReactToPrint({
      content: () => printRef.current,
      documentTitle,
   })

   useEffect(() => {
      const _dok = new Set(jadwalTipe === 'murni' ? ['rka'] : ['rkpa'])
      setSelectedDok(_dok)
   }, [jadwalTipe])

   return (
      <>
         <div className='top-navbar content sticky left-1/2 z-10 flex w-fit -translate-x-1/2 gap-4 rounded-b-3xl py-2 backdrop-blur'>
            <Button
               variant='shadow'
               color='danger'
               startContent={<ArrowBigLeft className='-ml-2' />}
               onPress={() => router.back()}>
               Kembali
            </Button>
            <Button
               disabled={!listPendapatan?.length}
               variant='shadow'
               color='primary'
               endContent={<Printer className='-mr-2' />}
               onPress={handlePrint}>
               Cetak
            </Button>
            <Dropdown>
               <DropdownTrigger>
                  <Button
                     variant='shadow'
                     color='secondary'
                     endContent={<Settings className='-mr-2' />}
                     className='capitalize'>
                     {jenisDok?.name || 'Pilih Jenis Dokumen'}
                  </Button>
               </DropdownTrigger>
               <DropdownMenu
                  selectionMode='single'
                  items={LIST_DOKUMEN}
                  onSelectionChange={setSelectedDok}
                  selectedKeys={selectedDok}
                  disabledKeys={selectedDok}
                  aria-label='Jenis Dokumen'>
                  {(item) => <DropdownItem key={item.key}>{item.name}</DropdownItem>}
               </DropdownMenu>
            </Dropdown>
         </div>
         <div className='content size-fit min-w-full max-w-max pb-10'>
            <div
               ref={printRef}
               className='bg-content1 rounded-medium p-2 shadow sm:p-4 print:bg-white print:p-0 print:text-black'>
               <table className='min-w-full'>
                  <tbody className='text-center font-bold uppercase'>
                     <tr>
                        <td className='cell-print'>
                           <div className='p-2'>
                              <p className='uppercase'>{jenisDok?.title}</p>
                              <p>SATUAN KERJA PERANGKAT DAERAH</p>
                           </div>
                        </td>
                        <td
                           rowSpan={2}
                           className='cell-print'>
                           <div className='p-2'>
                              <p>FORMULIR</p>
                              <p>{jenisDok?.kode}-PENDAPATAN</p>
                              <p>SKPD</p>
                           </div>
                        </td>
                     </tr>
                     <tr>
                        <td className='cell-print '>
                           <p className='p-2'>KABUPATEN LEMBATA TAHUN ANGGARAN {tahun}</p>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div className='h-2' />
               <table className='min-w-full font-bold'>
                  <tbody>
                     {jenisDok?.key?.startsWith('rk') ? (
                        <>
                           <tr className='border-print'>
                              <td className='p-1'>Organisasi</td>
                              <td>:</td>
                              <td>
                                 {unit?.kode_skpd} {unit?.nama_skpd}
                              </td>
                           </tr>
                           <tr className='border-print'>
                              <td className='p-1'>Unit Organisasi</td>
                              <td>:</td>
                              <td>
                                 {skpd?.kode_skpd} {skpd?.nama_skpd}
                              </td>
                           </tr>
                        </>
                     ) : (
                        <>
                           <tr>
                              <td className='cell-print border-r-0 border-t-0'>Nomor</td>
                              <td className='cell-print border-0 border-t'>:</td>
                              <td className='cell-print border-l-0 border-t-0'>
                                 {jenisDok?.kode}/A.1/{skpd?.kode_skpd}
                                 /......./{skpd?.tahun}
                              </td>
                           </tr>
                           <tr>
                              <td className='cell-print border-b-0 border-r-0'>SKPD</td>
                              <td className='cell-print border-0 border-t'>:</td>
                              <td className='cell-print border-b-0 border-l-0'>
                                 {skpd?.kode_skpd} {skpd?.nama_skpd}
                              </td>
                           </tr>
                        </>
                     )}
                  </tbody>
               </table>
               <div className='px-5 py-2 text-center font-bold'>
                  <p>{jenisDok?.header}</p>
                  <p>Satuan Kerja Perangkat Daerah</p>
               </div>
               <table className='min-w-full'>
                  {jenisDok?.type === 'perubahan' ? <TheadPerubahan /> : <TheadMurni />}
                  <tbody>
                     {listPendapatan?.map((item) => {
                        return jenisDok?.type === 'perubahan' ? (
                           <RowPerubahan
                              key={item?.nomor_urut}
                              item={item}
                           />
                        ) : (
                           <RowMurni
                              key={item?.nomor_urut}
                              item={item}
                           />
                        )
                     })}
                  </tbody>
               </table>
               <div className='h-2' />
               <TableKepalaSkpd
                  className='text-medium'
                  nama_jabatan_kepala={skpd?.nama_jabatan_kepala}
                  nama_kepala={skpd?.nama_kepala}
                  nip_kepala={skpd?.nip_kepala}
                  pangkat_kepala={skpd?.pangkat_kepala}
               />
               <div className='h-2' />
               {jenisDok?.key?.startsWith('rk') && (
                  <>
                     <TableCatatanRka printPreview />
                     <div className='h-2' />
                  </>
               )}
               <TableAnggotaTapd
                  className='text-medium'
                  values={tapd}
                  onChange={setTapd}
               />
            </div>
         </div>
      </>
   )
}

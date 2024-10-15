'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ExcelIcon } from '@components/icons/excel'
import { TableAnggotaTapd } from '@components/master/tapd'
import TableCatatanRka from '@components/perencanaan/table-catatan-rka'
import TableKepalaSkpd from '@components/perencanaan/table-kepala-skpd'
import {
   Button,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger,
   Popover,
   PopoverContent,
   PopoverTrigger,
   Radio,
   RadioGroup,
} from '@nextui-org/react'
import { Download, Printer, Settings } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'

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
   skpd: UnitLaporan
   unit: UnitLaporan
   anggotaTapd: TapdLaporan[]
   listPendapatan: ItemLaporanPendapatan[]
   tahun: number
}) {
   const [selectedDok, setSelectedDok] = useState('rka')
   const [tapd, setTapd] = useState(anggotaTapd)
   const printRef = useRef(null)

   const jenisDok = useMemo(() => {
      if (selectedDok) {
         return LIST_DOKUMEN.find((item) => item.key === selectedDok)
      }
      return LIST_DOKUMEN[0]
   }, [selectedDok])

   useEffect(() => {
      setSelectedDok(jadwalTipe === 'murni' ? 'rka' : 'rkpa')
   }, [jadwalTipe])

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

   const handleExport = () => {
      toast.warning('Export excel masih dalam proses pengembangan')
   }

   return (
      <>
         <div className='top-navbar sticky left-1/2 z-10 flex w-fit -translate-x-1/2 gap-4 rounded-b-3xl py-2 backdrop-blur'>
            <Popover
               placement='bottom'
               showArrow
               offset={10}>
               <PopoverTrigger>
                  <Button
                     variant='shadow'
                     color='secondary'
                     className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20 sm:px-3'
                     startContent={<Settings className='size-5' />}>
                     <span className='hidden sm:inline-flex'>Pengaturan</span>
                  </Button>
               </PopoverTrigger>
               <PopoverContent>
                  {(titleProps) => (
                     <div className='w-full px-1 py-2'>
                        <p
                           className='text-small text-foreground font-bold'
                           {...titleProps}>
                           Pengaturan Cetak / Unduh
                        </p>
                        <div className='flex w-full flex-col gap-3 pt-3'>
                           <RadioGroup
                              size='sm'
                              value={selectedDok}
                              onValueChange={setSelectedDok}
                              label='Cetak Sabagai'>
                              {LIST_DOKUMEN?.map(({ key, name }) => {
                                 return (
                                    <Radio
                                       key={key}
                                       value={key}>
                                       {name}
                                    </Radio>
                                 )
                              })}
                           </RadioGroup>
                        </div>
                     </div>
                  )}
               </PopoverContent>
            </Popover>
            <Dropdown>
               <DropdownTrigger>
                  <Button
                     variant='shadow'
                     color='primary'
                     className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20 sm:px-3'
                     startContent={<Download className='size-5' />}>
                     <span className='hidden sm:inline-flex'>Cetak</span>
                  </Button>
               </DropdownTrigger>
               <DropdownMenu
                  selectionMode='single'
                  aria-label='Cetak/dowload'>
                  <DropdownItem
                     color='primary'
                     key={'cetak'}
                     onPress={handlePrint}
                     endContent={<Printer className='size-5' />}>
                     Print
                  </DropdownItem>
                  <DropdownItem
                     color='secondary'
                     key={'export'}
                     onPress={handleExport}
                     endContent={<ExcelIcon className='size-5' />}>
                     Export Excel
                  </DropdownItem>
               </DropdownMenu>
            </Dropdown>
         </div>

         <div
            ref={printRef}
            className='page-print bg-content1 rounded-medium min-w-full max-w-max p-2 shadow sm:p-4 print:text-sm'>
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
            <table className='min-w-full max-w-full'>
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
      </>
   )
}

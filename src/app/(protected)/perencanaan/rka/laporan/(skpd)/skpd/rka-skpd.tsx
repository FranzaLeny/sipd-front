'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExcelIcon } from '@components/icons/excel'
import { TableAnggotaTapd } from '@components/master/tapd'
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

import { TbodyMurni, TbodyPerubahan, TheadMurni, TheadPerubahan } from './components'

const LIST_DOKUMEN = [
   {
      key: 'rka',
      name: 'RKA',
      title: 'Rencana Kerja dan Anggaran',
      kode: 'RKA',
      header: 'Ringkasan Anggaran Pendapatan dan Belanja',
      type: 'murni',
   },
   {
      key: 'rkpa',
      name: 'RKA Perubahan',
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
      header: 'Ringkasan Perubahan Anggaran Pendapatan dan Belanja',
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

export default function RkaSkpd({
   listRekapan = [],
   anggotaTapd,
   jadwalTipe,
   skpd,
   tahun,
   unit,
}: {
   tahun: number
   listRekapan: ItemLaporanRkaSKpd[]
   skpd: UnitLaporan
   unit: UnitLaporan
   jadwalTipe: 'perubahan' | 'murni'
   anggotaTapd: TapdLaporan[]
}) {
   const [selectedDok, setSelectedDok] = useState('rka')
   const [tapd, setTapd] = useState(anggotaTapd)
   const router = useRouter()
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
      let text = 'RKA_03_SKPD'
      if (!!skpd && !!jenisDok) {
         text =
            (
               jenisDok.kode +
               '_' +
               skpd?.kode_skpd?.substring(0, 6) +
               '_' +
               skpd?.nama_skpd?.substring(0, 120)
            )?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '_03_SKPD'
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
         <div className='top-navbar content sticky left-1/2 z-10 flex w-fit -translate-x-1/2 gap-4 rounded-b-3xl py-2 backdrop-blur'>
            <Popover
               placement='bottom'
               showArrow
               offset={10}>
               <PopoverTrigger>
                  <Button
                     variant='shadow'
                     color='secondary'
                     className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
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
         <div className='content size-fit min-w-full max-w-max pb-10'>
            <div
               ref={printRef}
               className='bg-content1 rounded-medium p-2 shadow sm:p-4 print:bg-white print:p-0 print:text-sm print:text-black'>
               <table className='min-w-full'>
                  <tbody className='text-center font-bold uppercase'>
                     <tr>
                        <td className='cell-print'>
                           <div className='p-2'>
                              <p>{jenisDok?.title}</p>
                              <p>SATUAN KERJA PERANGKAT DAERAH</p>
                           </div>
                        </td>
                        <td
                           rowSpan={2}
                           className='cell-print'>
                           <div className='p-2'>
                              <p>{jenisDok?.kode}</p>
                              <p>REKAPITULASI</p>
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
               <table className='min-w-full font-bold'>
                  <tbody>
                     <tr>
                        <td className='px-2 pb-0.5 pt-3'>Nomor</td>
                        <td className='pb-0.5 pt-3'>:</td>
                        <td className='px-2 pb-0.5 pt-3'>
                           {jenisDok?.kode}/A.1/{skpd?.kode_skpd}/
                           <span className='text-transparent'>______</span>/{skpd?.tahun}
                        </td>
                     </tr>
                     <tr>
                        <td className='px-2 py-0.5'>Organisasi</td>
                        <td className='py-0.5'>:</td>
                        <td className='px-2 py-0.5'>
                           {unit?.kode_skpd} {unit?.nama_skpd}
                        </td>
                     </tr>
                     <tr>
                        <td className='w-0 whitespace-nowrap px-2 pb-3 pt-0.5'>Unit Organisasi</td>
                        <td className='pb-3 pt-0.5'>:</td>
                        <td className='px-2 pb-3 pt-0.5'>
                           {skpd?.kode_skpd} {skpd?.nama_skpd}
                        </td>
                     </tr>
                     <tr>
                        <td
                           colSpan={3}
                           className='p-4 text-center font-normal'>
                           <p>{jenisDok?.header}</p>
                           <p>Satuan Kerja Perangkat Daerah</p>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <table className='min-w-full'>
                  {jenisDok?.type === 'perubahan' ? (
                     <>
                        <TheadPerubahan />
                        <TbodyPerubahan items={listRekapan} />
                     </>
                  ) : (
                     <>
                        <TheadMurni />
                        <TbodyMurni items={listRekapan} />
                     </>
                  )}
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
      </>
   )
}

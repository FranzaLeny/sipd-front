'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExcelIcon } from '@components/icons/excel'
import { TableAnggotaTapd } from '@components/master/tapd'
import TableCatatanRka from '@components/perencanaan/table-catatan-rka'
import TableKepalaSkpd from '@components/perencanaan/table-kepala-skpd'
import {
   Button,
   Checkbox,
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

import {
   RenderRincianMurni,
   RenderRincianPerubahan,
   TheadMurni,
   TheadPerubahan,
} from './components'
import dowloadRekapBlRka from './excel-murni'
import dowloadRekapBlRkpa from './excel-perubahan'

const LIST_DOKUMEN = [
   {
      key: 'rka',
      name: 'RKA',
      title: 'Rencana Kerja dan Anggaran',
      kode: 'RKA',
      header: 'Rincian Anggaran Belanja Berdasarkan Program dan Kegiatan',
      type: 'murni',
   },
   {
      key: 'rkpa',
      name: 'RKA Perubahan',
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
      header: 'Rincian Perubahan Anggaran Belanja Berdasarkan Program dan Kegiatan',
      type: 'perubahan',
   },
   {
      key: 'RDPA',
      name: 'RDPA',
      title: 'Rancangan Dokumen Pelaksanaan Anggaran',
      kode: 'RDPA',
      header:
         'Rekapitulasi Rancangan Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, dan Sub Kegiatan',
      type: 'murni',
   },
   {
      key: 'rdppa',
      name: 'RDPPA',
      title: 'Rancangan Dokumen Pelaksanaan dan Perubahan Anggaran',
      kode: 'RDPPA',
      header:
         'Rekapitulasi Rancangan Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, dan Sub Kegiatan',
      type: 'perubahan',
   },
]

export default function RkaRekapBl({
   listBl,
   skpd,
   tahun,
   jadwalTipe,
   anggotaTapd,
   unit,
}: {
   tahun: number
   listBl: ItemLaporanBlSkpd[]
   skpd: UnitLaporan
   unit: UnitLaporan
   jadwalTipe: 'perubahan' | 'murni'
   anggotaTapd: TapdLaporan[]
}) {
   const [selectedDok, setSelectedDok] = useState('rka')
   const [tapd, setTapd] = useState(anggotaTapd)
   const [showKet, setShowKet] = useState(false)

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
      let text = 'RKA_05_BELANJA'
      if (!!skpd && !!jenisDok) {
         text =
            (
               jenisDok.kode +
               '_' +
               skpd?.kode_skpd?.substring(0, 6) +
               '_' +
               skpd?.nama_skpd?.substring(0, 120)
            )?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '_05_BELANJA'
      }
      return text
   }, [skpd, jenisDok])
   const handlePrint = useReactToPrint({
      content: () => printRef.current,
      documentTitle,
   })
   const handleExport = useCallback(async () => {
      try {
         if (jenisDok?.type === 'perubahan') {
            await dowloadRekapBlRkpa({ dokumen: jenisDok, items: listBl, skpd, tahun, tapd })
         } else if (jenisDok?.type === 'murni') {
            await dowloadRekapBlRka({ dokumen: jenisDok, items: listBl, skpd, tahun, tapd })
         } else {
            throw new Error('Jenis Dokumen Tidak ada')
         }
      } catch (error) {
         console.error(error)
         toast.error('Gagal download excel rekapan belanja ' + skpd?.nama_skpd)
      }
   }, [jenisDok, tahun, tapd, listBl, skpd])
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
                           <Checkbox
                              size='sm'
                              radius='full'
                              isSelected={showKet}
                              onValueChange={setShowKet}>
                              Keterangan
                           </Checkbox>

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
         <div className='content size-fit min-w-full max-w-max pb-10 '>
            <div
               ref={printRef}
               className='bg-content1 rounded-medium max-w-max p-2 shadow sm:p-4 print:bg-white print:p-0 print:text-sm print:text-black'>
               <table className='min-w-full '>
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
                              <p>REKAPITULASI</p>
                              <p>{jenisDok?.kode}-BELANJA</p>
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
                     <tr className='border-print'>
                        <td className='w-0 px-2 py-1'>Nomor</td>
                        <td className='w-0'>:</td>
                        <td className='px-2 py-1'>
                           {jenisDok?.kode}/A.1/{skpd?.kode_skpd}/
                           <span className='text-transparent'>______</span>/{skpd?.tahun}
                        </td>
                     </tr>
                     <tr className='border-print'>
                        <td className='px-2 py-1'>Organisasi</td>
                        <td>:</td>
                        <td className='px-2 py-1'>
                           {unit?.kode_skpd} {unit?.nama_skpd}
                        </td>
                     </tr>
                     <tr className='border-print'>
                        <td className='whitespace-nowrap px-2 py-1'>Unit Organisasi</td>
                        <td>:</td>
                        <td className='px-2 py-1'>
                           {skpd?.kode_skpd} {skpd?.nama_skpd}
                        </td>
                     </tr>
                  </tbody>
               </table>
               <p className='px-5 py-2 text-center font-bold'>{jenisDok?.header}</p>
               <table className='tmin-w-full text-sm'>
                  {jenisDok?.type === 'perubahan' ? (
                     <TheadPerubahan
                        tahun={tahun}
                        showKet={showKet}
                     />
                  ) : (
                     <TheadMurni
                        tahun={tahun}
                        showKet={showKet}
                     />
                  )}
                  <tbody>
                     {listBl?.map((item) => {
                        return jenisDok?.type === 'perubahan' ? (
                           <RenderRincianPerubahan
                              key={item.nomor_urut}
                              item={item}
                              showKet={showKet}
                           />
                        ) : (
                           <RenderRincianMurni
                              key={item.nomor_urut}
                              item={item}
                              showKet={showKet}
                           />
                        )
                     })}
                  </tbody>
               </table>
               <div className='h-2' />
               <TableKepalaSkpd
                  className='print:text-[15pt]'
                  classNameSpace='h-16'
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
                  className='print:text-[15pt]'
                  values={tapd}
                  onChange={setTapd}
               />
            </div>
         </div>
      </>
   )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { getBlSubGiatById } from '@actions/perencanaan/rka/bl-sub-giat'
import { getLaporanSubGiat } from '@actions/perencanaan/rka/laporan'
import BlSubGiatSelector from '@components/perencanaan/bl-sub-giat'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import Loading from '@components/ui/loading'
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
import { useQuery } from '@tanstack/react-query'
import { Download, PlusCircle, Printer, Settings } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'

import dowloadRkaRinciBl from '../../laporan/rinci-bl/excel-murni'
import dowloadRkpaRinciBl from '../../laporan/rinci-bl/excel-perubahan'
import Template from './template'

const LIST_DOKUMEN = [
   {
      key: 'rka',
      name: 'RKA',
      title: 'Rencana Kerja dan Anggaran',
      kode: 'RKA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, Kegiatan dan Sub Kegiatan',
      type: 'murni',
   },
   {
      key: 'rdpa',
      name: 'RDPA',
      title: 'Rancangan Dokumen Pelaksanaan Anggaran',
      kode: 'RDPA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, Kegiatan dan Sub Kegiatan',
      type: 'murni',
   },
   {
      key: 'rkpa',
      name: 'RKPA ',
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, Kegiatan dan Sub Kegiatan',
      type: 'perubahan',
   },

   {
      key: 'rdppa',
      name: 'RDPPA',
      title: 'Rancangan Dokumen Pelaksanaan dan Perubahan Anggaran',
      kode: 'RDPPA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, Kegiatan dan Sub Kegiatan',
      type: 'perubahan',
   },
]
export type JenisDokumen = (typeof LIST_DOKUMEN)[number]
export type SubGiatWithRinci = AsyncReturnType<typeof getBlSubGiatById<true>>

export default function Rincian({
   id,
   daerah,
   unit,
   tahun,
}: {
   id: string
   unit: number
   daerah: number
   tahun: number
}) {
   const [blSubGiatId, setBlSubGiatId] = useState<string | null>(id)
   const [jadwal, setJadwal] = useState<string>()
   const [printPreview, setPrintPreview] = useState(false)
   const [selectedDok, setSelectedDok] = useState('rka')
   // const [dataTapd, setDataTapd] = useState<SubGiatWithRinci['skpd']['tapd']>()
   const { data, isFetching } = useQuery({
      queryKey: [blSubGiatId, 'jadwal_anggaran', 'bl_sub_giat', 'bl_sub_giat_rinci'],
      queryFn: async ({ queryKey: [id] }) => (id ? await getBlSubGiatById(id, true) : undefined),
      enabled: !!blSubGiatId,
   })
   const { isFetching: isFetchingLaporan, refetch: refetchLaporan } = useQuery({
      queryKey: [
         blSubGiatId,
         'jadwal_anggaran',
         'bl_sub_giat',
         'bl_sub_giat_rinci',
         'getLaporanSubGiat',
      ],
      queryFn: async ({ queryKey: [id] }) => (id ? await getLaporanSubGiat(id) : undefined),
      enabled: false,
   })
   const jenisDok = useMemo(() => {
      if (selectedDok) {
         const doc = LIST_DOKUMEN.find((item) => item.key === selectedDok)
         if (!!doc) return doc
      }
      return LIST_DOKUMEN[0]
   }, [selectedDok])

   const paramsBlSubGiat = useMemo(() => {
      if (!!id) {
         if (
            !!!data?.jadwal?.id ||
            (!!data?.jadwal?.id && data?.jadwal?.id === jadwal && data?.jadwal?.tahun === tahun)
         ) {
            return { bl_sub_giat_id: id }
         }
      }
      return { id_unit: unit, jadwal_anggaran_id: jadwal, id_daerah: daerah }
   }, [id, unit, jadwal, daerah, data?.jadwal?.id, data?.jadwal?.tahun, tahun])

   const handleJadwalChange = (jadwal?: string) => {
      setJadwal(jadwal)
      setBlSubGiatId('')
   }

   useEffect(() => {
      if (!!data?.jadwal?.tahun && data?.jadwal?.tahun !== tahun) {
         setJadwal('')
         setBlSubGiatId('')
      }
      if (data?.jadwal?.id) {
         setJadwal(data?.jadwal?.id)
      }
      if (data?.jadwal?.is_perubahan === 1) {
         setSelectedDok('rkpa')
      } else if (data?.jadwal?.is_perubahan === 0) {
         setSelectedDok('rka')
      }
   }, [data?.jadwal, tahun])

   const componentRef = useRef(null)

   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
   })

   const typeDok = useMemo(() => {
      if (data?.jadwal?.is_perubahan) {
         return 'perubahan'
      }
      return 'murni'
   }, [data?.jadwal])

   const handleExportExcel = async () => {
      await refetchLaporan().then(async ({ data }) => {
         if (!data) {
            toast.error('Laporan tidak ditemukan')
            return
         }
         const params = {
            dokumen: jenisDok,
            items: data.rincian,
            skpd: data?.skpd?.sub_skpd,
            subGiat: data?.sub_kegiatan,
            tapd: data?.skpd?.tapd,
         }
         if (jenisDok.type === 'murni') {
            await dowloadRkaRinciBl([params])
         } else {
            await dowloadRkpaRinciBl([params])
         }
      })
   }

   return (
      <>
         <div className='content sticky left-0 space-y-3 '>
            <div className='bg-content1 space-y-2 p-2 sm:p-4'>
               <JadwalInput
                  selectedKey={jadwal}
                  params={{ tahun, id_daerah: daerah, filter: 'has-rincian' }}
                  onSelectionChange={handleJadwalChange}
                  label='Pilih Jadwal Rincian Belanja'
                  isInvalid={!!!jadwal}
                  errorMessage={'Harus pilih jadwal'}
               />
               {jadwal && (
                  <div>
                     <BlSubGiatSelector
                        label='Pilih Sub Kegiatan'
                        labelPlacement='inside'
                        selectedKey={blSubGiatId}
                        params={paramsBlSubGiat}
                        onSelectionChange={setBlSubGiatId}
                        isInvalid={!blSubGiatId}
                        errorMessage={'Harus pilih sub kegiatan'}
                     />
                  </div>
               )}
            </div>
         </div>
         {(isFetching || isFetchingLaporan) && <Loading className='absolute z-10' />}
         {data?.jadwal?.tahun === tahun && (
            <div className='content to-content1 relative bg-gradient-to-b px-4 pb-14'>
               <div className='top-navbar sticky left-1/2 z-10 flex w-fit -translate-x-1/2 gap-4 rounded-b-3xl py-2 backdrop-blur'>
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
                                 <Checkbox
                                    size='sm'
                                    radius='full'
                                    isSelected={printPreview}
                                    onValueChange={setPrintPreview}>
                                    Print Priview
                                 </Checkbox>
                                 <RadioGroup
                                    size='sm'
                                    value={selectedDok}
                                    onValueChange={setSelectedDok}
                                    label='Cetak Sabagai'>
                                    {LIST_DOKUMEN?.map(({ key, name, type }) => {
                                       return (
                                          <Radio
                                             key={key}
                                             value={key}>
                                             {typeDok !== type && 'FORM'} {name}
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
                           className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
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
                           onPress={handleExportExcel}
                           endContent={<Download className='size-5' />}>
                           Export Excel
                        </DropdownItem>
                     </DropdownMenu>
                  </Dropdown>
                  <Button
                     variant='solid'
                     color='success'
                     className='sm:rounded-medium min-w-10 rounded-full px-2 backdrop-blur-sm sm:min-w-20'
                     startContent={<PlusCircle className='size-5' />}
                     as={Link}
                     prefetch={false}
                     scroll={false}
                     href={`/perencanaan/rka/rinci/add?bl_sub_giat_id=${data?.sub_kegiatan?.id}`}>
                     <span className='hidden sm:inline-flex'>Tambah</span>
                  </Button>
               </div>

               <Template
                  ref={componentRef}
                  defaultData={data}
                  printPreview={printPreview}
               />
            </div>
         )}
      </>
   )
}

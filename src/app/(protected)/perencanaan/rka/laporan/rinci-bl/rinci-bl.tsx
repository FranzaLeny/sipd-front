'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAllBlSubGiat } from '@actions/perencanaan/rka/bl-sub-giat'
import { getLaporanSubGiat } from '@actions/perencanaan/rka/laporan'
import { ExcelIcon, XlsxIcon } from '@components/icons/excel'
import { TableAnggotaTapd } from '@components/master/tapd'
import BlSubGiatSelector from '@components/perencanaan/bl-sub-giat'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import TableCatatanRka from '@components/perencanaan/table-catatan-rka'
import TableKepalaSkpd from '@components/perencanaan/table-kepala-skpd'
import Loading from '@components/ui/loading'
import {
   Button,
   Checkbox,
   cn,
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
import { numberToMonth, numberToText } from '@utils'
import { Download, Printer, Settings } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'
import { LaporanBlSubGiat } from '@/types/api/laporan'

import dowloadRkaRinciBl from './excel-murni'
import dowloadRkpaRinciBl from './excel-perubahan'
import RkaRinciBl, { TableIndikatorGiat } from './murni'
import RkpaRinciBl, { TableIndikatorGiatPerubahan } from './perubahan'

const LIST_DOKUMEN = [
   {
      key: 'rka',
      name: 'RKA',
      title: 'Rencana Kerja dan Anggaran',
      kode: 'RKA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, Kegiatan dan Sub Kegiatan',
      category: 'rka',
   },
   {
      key: 'rdpa',
      name: 'RDPA',
      title: 'Rancangan Dokumen Pelaksanaan Anggaran',
      kode: 'RDPA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, Kegiatan dan Sub Kegiatan',
      category: 'rka',
   },
   {
      key: 'rkpa',
      name: 'RKPA ',
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, Kegiatan dan Sub Kegiatan',
      category: 'dpa',
   },

   {
      key: 'rdppa',
      name: 'RDPPA',
      title: 'Rancangan Dokumen Pelaksanaan dan Perubahan Anggaran',
      kode: 'RDPPA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, Kegiatan dan Sub Kegiatan',
      category: 'dpa',
   },
]
export type LaporanRinciBl = AsyncReturnType<typeof getLaporanSubGiat>
export type JenisDokumen = (typeof LIST_DOKUMEN)[number]

export default function RinciBl({
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
   const [keluaranSub, setKeluaranSub] = useState(false)
   const [selectedDok, setSelectedDok] = useState('rka')
   const [isPerubahan, setIsPerubahan] = useState(false)
   const [disableDocKeys, setDisableDocKeys] = useState(['rkpa', 'rdppa'])
   const [paguPerubahan, setPaguPerubahan] = useState(false)
   const [jadwal, setJadwal] = useState<string>()

   const [printDeleted, setPrintDeleted] = useState(true)

   const [isLoading, setIsLoading] = useState(false)

   const {
      data: defaultData,
      isFetched,
      isFetching,
   } = useQuery({
      queryKey: [
         blSubGiatId,
         'jadwal_anggaran',
         'bl_sub_giat',
         'bl_sub_giat_rinci',
         'getLaporanSubGiat',
      ],
      queryFn: async ({ queryKey: [id] }) => (id ? await getLaporanSubGiat(id) : undefined),
      enabled: !!blSubGiatId,
   })
   const data = useMemo(() => {
      if (!!defaultData && paguPerubahan) {
         return generatePerubahan(defaultData)
      }
      return defaultData
   }, [defaultData, paguPerubahan])

   const [tapd, setTapd] = useState(data?.skpd?.tapd)

   const handleJadwalChange = (jadwal?: string) => {
      setJadwal(jadwal)
      setBlSubGiatId('')
   }

   const jenisDok = useMemo(() => {
      if (selectedDok) {
         const doc = LIST_DOKUMEN.find((item) => item.key === selectedDok)
         if (!!doc) return doc
      }
      return LIST_DOKUMEN[0]
   }, [selectedDok])

   useEffect(() => {
      if (!!data?.jadwal?.tahun && data?.jadwal?.tahun !== tahun) {
         setJadwal('')
         setBlSubGiatId('')
      }
      if (data?.jadwal?.id) {
         setJadwal(data?.jadwal?.id)
      }
      if (data?.jadwal?.is_perubahan === 1) {
         setIsPerubahan(true)
      } else if (data?.jadwal?.is_perubahan === 0) {
         setIsPerubahan(false)
      }
   }, [data?.jadwal, tahun])

   useEffect(() => {
      setPaguPerubahan(false)
      if (isPerubahan) {
         setSelectedDok('rkpa')
         setDisableDocKeys(['rka', 'rdpa'])
      } else {
         setDisableDocKeys(['rkpa', 'rdppa'])
         setSelectedDok('rka')
      }
   }, [isPerubahan])

   const documentTitle = useMemo(() => {
      let text = 'RKA_06_RICIAN_BELANJA'
      if (data?.sub_kegiatan && !!jenisDok) {
         text =
            (
               jenisDok.kode +
               '_' +
               data?.sub_kegiatan?.kode_sub_giat +
               '_' +
               data?.sub_kegiatan?.nama_sub_giat
            )
               ?.substring(0, 120)
               ?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + `_${data?.skpd?.sub_skpd?.id_skpd}`
      }
      return text
   }, [data, jenisDok])

   const handleExportExcel = useCallback(async () => {
      setIsLoading(true)
      try {
         if (!!!data) throw new Error('Data sub kegiatan tidak ditemukan')
         const params = {
            dokumen: jenisDok,
            items: data.rincian,
            skpd: data?.skpd?.sub_skpd,
            subGiat: data?.sub_kegiatan,
            tapd: tapd ?? data?.skpd?.tapd,
         }
         if (isPerubahan) {
            await dowloadRkpaRinciBl([params])
         } else {
            await dowloadRkaRinciBl([params])
         }
         toast.success('Selesai export excel')
      } catch (error) {
         toast.error((error as Error).message)
      }
      setIsLoading(false)
   }, [isPerubahan, jenisDok, data, tapd])

   const handleExporAllSub = useCallback(async () => {
      setIsLoading(true)
      try {
         if (!jadwal) throw new Error('Data jadwal tidak ditemukan')
         const listSubGiat = await getAllBlSubGiat({
            id_unit: unit,
            jadwal_anggaran_id: jadwal,
            id_daerah: daerah,
            tahun: tahun,
         })
         const listData: {
            dokumen: typeof jenisDok
            items: LaporanBlSubGiat['rincian']
            skpd: LaporanBlSubGiat['skpd']['sub_skpd']
            subGiat: LaporanBlSubGiat['sub_kegiatan']
            tapd: LaporanBlSubGiat['skpd']['tapd']
         }[] = []
         for await (const sbl of listSubGiat) {
            await getLaporanSubGiat(sbl?.id).then((res) => {
               const currData = paguPerubahan ? generatePerubahan(res) : res
               const item = {
                  dokumen: jenisDok,
                  items: currData.rincian,
                  skpd: currData?.skpd?.sub_skpd,
                  subGiat: currData?.sub_kegiatan,
                  tapd: tapd ?? currData?.skpd?.tapd,
               }
               listData.push(item)
            })
         }
         if (!listData.length) throw new Error('Data sub kegiatan tidak ditemukan')
         if (isPerubahan) {
            await dowloadRkpaRinciBl(listData)
         } else {
            await dowloadRkaRinciBl(listData)
         }
         toast.success('Selesai export semua sub kegiatan')
      } catch (error) {
         toast.error((error as Error).message)
      }
      setIsLoading(false)
   }, [daerah, jadwal, jenisDok, tahun, tapd, unit, isPerubahan, paguPerubahan])

   const componentRef = useRef(null)
   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle,
   })

   const paramsBlSubGiat = useMemo(() => {
      if (!!id) {
         if (!data?.jadwal?.id || (!!data?.jadwal?.id && !!id && data?.jadwal?.id === jadwal)) {
            return { bl_sub_giat_id: id }
         }
      }
      return { id_unit: unit, jadwal_anggaran_id: jadwal, id_daerah: daerah }
   }, [id, unit, jadwal, daerah, data?.jadwal?.id])

   return (
      <>
         <div className='content sticky left-0 space-y-3 '>
            <div className='bg-content1 space-y-2 p-2 sm:p-4'>
               <JadwalInput
                  selectedKey={jadwal}
                  params={{ tahun, id_daerah: daerah, filter: 'has-bl-sub-giat' }}
                  onSelectionChange={handleJadwalChange}
                  label='Pilih Jadwal Rincian Belanja'
               />
               {jadwal && (
                  <div>
                     <BlSubGiatSelector
                        label='Pilih Sub Kegiatan'
                        labelPlacement='inside'
                        selectedKey={blSubGiatId}
                        params={paramsBlSubGiat}
                        onSelectionChange={setBlSubGiatId}
                     />
                  </div>
               )}
            </div>
         </div>
         {isFetching && <Loading />}
         {isFetched && !!data && (
            <>
               <div className='top-navbar sticky left-1/2 z-10 flex w-fit -translate-x-1/2 gap-4 rounded-b-3xl py-2 backdrop-blur'>
                  <Popover
                     placement='bottom'
                     showArrow
                     offset={10}>
                     <PopoverTrigger>
                        <Button
                           isDisabled={isLoading}
                           variant='shadow'
                           color='secondary'
                           endContent={<Settings className='-mr-2 size-5' />}>
                           Pengaturan
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
                                    isSelected={printDeleted}
                                    onValueChange={setPrintDeleted}>
                                    Cetak yang terhapus
                                 </Checkbox>
                                 <Checkbox
                                    size='sm'
                                    radius='full'
                                    isSelected={keluaranSub}
                                    onValueChange={setKeluaranSub}>
                                    Indikator Sub Kegiatan
                                 </Checkbox>
                                 <Checkbox
                                    size='sm'
                                    radius='full'
                                    isSelected={isPerubahan}
                                    onValueChange={setIsPerubahan}>
                                    Dokumen Perubahan
                                 </Checkbox>
                                 {data?.jadwal?.is_perubahan === 1 && (
                                    <Checkbox
                                       size='sm'
                                       radius='full'
                                       isDisabled={!isPerubahan}
                                       isSelected={paguPerubahan}
                                       onValueChange={setPaguPerubahan}>
                                       Pagu Perbahahan
                                    </Checkbox>
                                 )}
                                 <RadioGroup
                                    size='sm'
                                    value={selectedDok}
                                    onValueChange={setSelectedDok}
                                    label='Cetak Sabagai'>
                                    {LIST_DOKUMEN?.map(({ key, name }) => {
                                       return (
                                          <Radio
                                             isDisabled={disableDocKeys.includes(key)}
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
                           isLoading={isLoading}
                           variant='shadow'
                           color='primary'
                           endContent={<Download className='-mr-2 size-5' />}>
                           Cetak
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
                           endContent={<XlsxIcon className='size-5' />}>
                           Export Excel
                        </DropdownItem>
                        <DropdownItem
                           color='success'
                           key={'export-all'}
                           onPress={handleExporAllSub}
                           endContent={<ExcelIcon className='size-5' />}>
                           Export Semua
                        </DropdownItem>
                     </DropdownMenu>
                  </Dropdown>
               </div>
               <div className='content pb-20'>
                  <div
                     ref={componentRef}
                     className={`size-fit min-w-full max-w-max p-2 text-sm shadow sm:p-4 print:bg-white print:p-0 print:text-xs print:text-black`}>
                     <TableKop
                        jenisDok={jenisDok}
                        tahun={data?.sub_kegiatan?.tahun}
                     />
                     <TableGiat
                        jenisDok={jenisDok}
                        subGiat={data?.sub_kegiatan}
                     />
                     {isPerubahan ? (
                        <TableIndikatorGiatPerubahan
                           keluaranSub={keluaranSub}
                           capaian_bl_giat={data?.sub_kegiatan?.capaian_bl_giat}
                           capaian_bl_giat_murni={data?.sub_kegiatan?.capaian_bl_giat_murni}
                           hasil_bl_giat={data?.sub_kegiatan?.hasil_bl_giat}
                           hasil_bl_giat_murni={data?.sub_kegiatan?.hasil_bl_giat_murni}
                           output_bl_giat={data?.sub_kegiatan?.output_bl_giat}
                           output_bl_giat_murni={data?.sub_kegiatan?.output_bl_giat_murni}
                           output_bl_sub_giat={data?.sub_kegiatan?.output_bl_sub_giat}
                           output_bl_sub_giat_murni={data?.sub_kegiatan?.output_bl_sub_giat_murni}
                           pagu={data?.sub_kegiatan?.pagu}
                           pagu_murni={data?.sub_kegiatan?.pagu_murni}
                        />
                     ) : (
                        <TableIndikatorGiat
                           keluaranSub={keluaranSub}
                           capaian_bl_giat={data?.sub_kegiatan?.capaian_bl_giat}
                           hasil_bl_giat={data?.sub_kegiatan?.hasil_bl_giat}
                           output_bl_sub_giat={data?.sub_kegiatan?.output_bl_sub_giat}
                           pagu={data?.sub_kegiatan?.pagu}
                           output_bl_giat={data?.sub_kegiatan?.output_bl_giat}
                        />
                     )}
                     <TableSubGiat
                        keluaranSub={keluaranSub}
                        subGiat={data?.sub_kegiatan}
                     />

                     {isPerubahan ? (
                        <>
                           <RkpaRinciBl
                              printDeleted={printDeleted}
                              rincian={data?.rincian}
                           />
                        </>
                     ) : (
                        <>
                           <RkaRinciBl
                              printDeleted={printDeleted}
                              rincian={data?.rincian}
                           />
                        </>
                     )}
                     <TableKepalaSkpd
                        className='text-medium'
                        nama_jabatan_kepala={data?.skpd?.sub_skpd?.nama_jabatan_kepala}
                        nama_kepala={data?.skpd?.sub_skpd?.nama_kepala}
                        nip_kepala={data?.skpd?.sub_skpd?.nip_kepala}
                        pangkat_kepala={data?.skpd?.sub_skpd?.pangkat_kepala}
                     />
                     <div className='h-2' />
                     {jenisDok?.category === 'rka' && (
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
         )}
      </>
   )
}

function generatePerubahan(defaultData: LaporanBlSubGiat) {
   const subGiat: LaporanRinciBl['sub_kegiatan'] = {
      ...defaultData?.sub_kegiatan,
      capaian_bl_giat_murni: defaultData?.sub_kegiatan?.capaian_bl_giat,
      hasil_bl_giat_murni: defaultData?.sub_kegiatan?.hasil_bl_giat,
      output_bl_giat_murni: defaultData?.sub_kegiatan?.output_bl_giat,
      output_bl_sub_giat_murni: defaultData?.sub_kegiatan?.output_bl_sub_giat,
      pagu_murni: defaultData?.sub_kegiatan?.pagu,
   }
   const items: LaporanRinciBl['rincian'] = defaultData?.rincian.map((item) => {
      return {
         ...item,
         volume_murni: item.volume,
         harga_satuan_murni: item.harga_satuan,
         koefisien_murni: item.koefisien,
         selisih: 0,
         total_harga_murni: item.total_harga,
         pajak_murni: item.pajak,
         total_murni: item.total,
         satuan_murni: item.satuan,
      }
   })
   return {
      ...defaultData,
      sub_kegiatan: subGiat,
      rincian: items,
   }
}

function TableKop({ jenisDok, tahun }: { tahun: number; jenisDok?: JenisDokumen }) {
   return (
      <>
         <table className={`min-w-full text-center font-bold uppercase`}>
            <tbody>
               <tr className='print:break-inside-avoid'>
                  <td className='cell-print whitespace-nowrap px-5 uppercase'>
                     {jenisDok?.title}
                     <div>SATUAN KERJA PERANGKAT DAERAH</div>
                     <div>
                        Kabupaten Lembata Tahun Anggaran {tahun ? tahun : new Date().getFullYear()}
                     </div>
                  </td>
                  <td className='cell-print  px-5 py-2'>
                     <div>FORMULIR</div>
                     <div>{jenisDok?.kode}-RINCIAN BELANJA</div>
                     <div>SKPD</div>
                  </td>
               </tr>
            </tbody>
         </table>
         <div className='h-2' />
      </>
   )
}

function TableGiat({
   jenisDok,
   subGiat,
}: {
   jenisDok: JenisDokumen
   subGiat: LaporanRinciBl['sub_kegiatan']
}) {
   return (
      <>
         <table className='min-w-full'>
            <tbody className='align-top'>
               {jenisDok?.key?.includes('d') && (
                  <TrGiat label={`Nomor`}>
                     {jenisDok?.kode}/A.1/{subGiat.kode_skpd}/..../{subGiat.tahun}
                  </TrGiat>
               )}
               <TrGiat label='Urusan Pemerintahan'>
                  {subGiat.kode_urusan} {subGiat.nama_urusan}
               </TrGiat>
               <TrGiat label='Bidang Urusan'>
                  {subGiat.kode_bidang_urusan} {subGiat.nama_bidang_urusan}
               </TrGiat>
               <TrGiat label='Organisasi'>
                  {subGiat.kode_skpd} {subGiat.nama_skpd}
               </TrGiat>
               <TrGiat label='Unit'>
                  {subGiat.kode_sub_skpd} {subGiat.nama_sub_skpd}
               </TrGiat>
               <TrGiat label='Program'>
                  {subGiat.kode_program} {subGiat.nama_program}
               </TrGiat>
               <TrGiat label='Kegiatan'>
                  {subGiat.kode_giat} {subGiat.nama_giat}
               </TrGiat>
               <TrGiat label={`Alokasi ${subGiat.tahun - 1}`}>
                  Rp{numberToText(subGiat.pagu_n_lalu)}
               </TrGiat>
               <TrGiat label={`Alokasi ${subGiat.tahun}`}>Rp{numberToText(subGiat.pagu)}</TrGiat>
               <TrGiat label={`Alokasi ${subGiat.tahun + 1}`}>
                  Rp{numberToText(subGiat.pagu_n_depan)}
               </TrGiat>
            </tbody>
         </table>
         <div className='h-2' />
      </>
   )
}

function TrGiat({
   label,
   children,
   className,
}: {
   label: string
   children: React.ReactNode
   className?: string
}) {
   return (
      <tr className={cn('border-print align-top print:break-inside-avoid', className)}>
         <td className='whitespace-nowrap px-1.5 py-0.5'>{label}</td>
         <td className='w-5  text-center'>:</td>
         <td className='pr-1.5'>{children}</td>
      </tr>
   )
}

function TableSubGiat({
   subGiat = {} as any,
   keluaranSub = false,
}: {
   subGiat: LaporanRinciBl['sub_kegiatan']
   keluaranSub: boolean
}) {
   const {
      kode_sub_giat,
      nama_sub_giat,
      dana_bl_sub_giat,
      waktu_awal,
      waktu_akhir,
      output_bl_sub_giat,
      tag_bl_sub_giat,
      lokasi_bl_sub_giat,
      sasaran,
   } = subGiat
   return (
      <>
         <table className='min-w-full'>
            <tbody>
               <TrGiat
                  className='font-semibold'
                  label='Sub Kegiatan'>
                  {kode_sub_giat} {nama_sub_giat}
               </TrGiat>
               <TrGiat label='Sumber Pendanaan'>
                  {dana_bl_sub_giat?.map((item, i) => (
                     <div key={i}>
                        {item.nama_dana}
                        <span className='px-2 font-bold print:hidden'>
                           Rp{numberToText(item.pagu_dana)}
                        </span>
                     </div>
                  ))}
               </TrGiat>
               <TrGiat label='Lokasi'>
                  {lokasi_bl_sub_giat?.map((d, i) => (
                     <div key={i}>
                        {d.kab_kota?.nama_daerah ?? 'Semua Kabuapten'}
                        {', '}
                        {d.kecamatan?.camat_teks ?? 'Semua Kecamatan'}
                        {', '}
                        {d.lurah?.lurah_teks ?? 'Semua Kelurahan'}
                     </div>
                  ))}
               </TrGiat>
               {!keluaranSub && (
                  <TrGiat label='Keluaran Sub Kegiatan'>
                     {output_bl_sub_giat?.map((item, i) => <div key={i}>{item.tolak_ukur}</div>)}
                  </TrGiat>
               )}
               <TrGiat label='Waktu Pelaksanaan'>
                  {numberToMonth(waktu_awal)} s.d {numberToMonth(waktu_akhir)}
               </TrGiat>
               <TrGiat label='Kelompok Sasaran'>{sasaran}</TrGiat>
               <TrGiat label='Keterangan'>
                  {tag_bl_sub_giat?.map((item, i) => <div key={i}>{item.nama_label_giat}</div>)}
               </TrGiat>
            </tbody>
         </table>
         <div className='h-2' />
      </>
   )
}

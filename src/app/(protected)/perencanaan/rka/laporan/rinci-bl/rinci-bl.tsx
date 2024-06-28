'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getLaporanSubGiat } from '@actions/perencanaan/rka/laporan'
import { TableAnggotaTapd } from '@components/master/tapd'
import BlSubGiatSelector from '@components/perencanaan/bl-sub-giat'
import JadwalInput from '@components/perencanaan/jadwal-anggaran'
import TableCatatanRka from '@components/perencanaan/table-catatan-rka'
import TableKepalaSkpd from '@components/perencanaan/table-kepala-skpd'
import Loading from '@components/ui/loading'
import {
   Button,
   cn,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger,
   Selection,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToMonth, numberToText } from '@utils'
import { ArrowLeftCircle, Download, Printer, Settings } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'

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
   const [selectedDok, setSelectedDok] = useState<Selection>(new Set(['rka']))
   const [jadwal, setJadwal] = useState<string>()
   const router = useRouter()

   const { data, isFetched, isFetching } = useQuery({
      queryKey: [blSubGiatId, 'detail_sub_giat'],
      queryFn: async ({ queryKey: [id] }) => (id ? await getLaporanSubGiat(id) : undefined),
      enabled: !!blSubGiatId,
   })

   const [tapd, setTapd] = useState(data?.skpd?.tapd)

   const handleJadwalChange = (jadwal?: string) => {
      setJadwal(jadwal)
      setBlSubGiatId('')
   }
   const jenisDok = useMemo(() => {
      const key = Array.from(selectedDok)[0]
      if (key) {
         const doc = LIST_DOKUMEN.find((item) => item.key === key)
         if (!!doc) return doc
      }
      return LIST_DOKUMEN[0]
   }, [selectedDok])

   const typeDok = useMemo(() => {
      if (data?.jadwal?.is_perubahan) {
         return 'perubahan'
      }
      return 'murni'
   }, [data?.jadwal])

   useEffect(() => {
      if (data?.jadwal?.id) {
         setJadwal(data?.jadwal?.id)
      }
      if (data?.jadwal?.is_perubahan === 1) {
         setSelectedDok(new Set(['rkpa']))
      } else if (data?.jadwal?.is_perubahan === 0) {
         setSelectedDok(new Set(['rka']))
      }
   }, [data?.jadwal])

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
      if (!data) return
      const params = {
         dokumen: jenisDok,
         items: data.rincian,
         skpd: data?.skpd?.sub_skpd,
         subGiat: data?.sub_kegiatan,
         tapd: tapd ?? data?.skpd?.tapd,
      }
      if (jenisDok.type === 'murni') {
         await dowloadRkaRinciBl(params)
      } else {
         await dowloadRkpaRinciBl(params)
      }
   }, [jenisDok, data, tapd])

   const isPerubahan = jenisDok?.type === 'perubahan'
   const componentRef = useRef(null)
   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle,
   })

   const back = useCallback(() => {
      router.back()
   }, [router])

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
                  <BlSubGiatSelector
                     label='Pilih Sub Kegiatan'
                     labelPlacement='inside'
                     selectedKey={blSubGiatId}
                     params={{ id_unit: unit, jadwal_anggaran_id: jadwal, id_daerah: daerah }}
                     onSelectionChange={setBlSubGiatId}
                  />
               )}
            </div>
         </div>
         {isFetching && <Loading />}
         {isFetched && !!data && (
            <>
               <div className='top-navbar  sticky left-1/2 z-10 flex w-fit -translate-x-1/2 gap-4 rounded-b-3xl py-2 backdrop-blur'>
                  <Button
                     color='danger'
                     className='sm:rounded-medium min-w-10 rounded-full px-2 backdrop-blur-sm sm:min-w-20'
                     onPress={back}>
                     <ArrowLeftCircle className='size-5' />
                     <span className='hidden sm:inline-flex'>Kembali</span>
                  </Button>
                  <Dropdown>
                     <DropdownTrigger>
                        <Button
                           variant='shadow'
                           color='secondary'
                           className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
                           startContent={<Settings className='size-5' />}>
                           <span className='hidden sm:inline-flex'>
                              {jenisDok?.name || 'Pilih Jenis Dokumen'}
                           </span>
                        </Button>
                     </DropdownTrigger>
                     <DropdownMenu
                        selectionMode='single'
                        items={LIST_DOKUMEN}
                        onSelectionChange={setSelectedDok}
                        selectedKeys={selectedDok}
                        disabledKeys={selectedDok}
                        aria-label='Jenis Dokumen'>
                        {(item) => (
                           <DropdownItem key={item.key}>
                              {item.name} {typeDok !== item?.type && '(FORM)'}
                           </DropdownItem>
                        )}
                     </DropdownMenu>
                  </Dropdown>
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
               <div className='content pb-20'>
                  <div
                     ref={componentRef}
                     id='rka'
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
                           capaian_bl_giat={data?.sub_kegiatan?.capaian_bl_giat}
                           hasil_bl_giat={data?.sub_kegiatan?.hasil_bl_giat}
                           output_bl_sub_giat={data?.sub_kegiatan?.output_bl_sub_giat}
                           pagu={data?.sub_kegiatan?.pagu}
                           output_bl_giat={data?.sub_kegiatan?.output_bl_giat}
                        />
                     )}
                     <TableSubGiat subGiat={data?.sub_kegiatan} />

                     {isPerubahan ? (
                        <>
                           <RkpaRinciBl rincian={data?.rincian} />
                        </>
                     ) : (
                        <>
                           <RkaRinciBl rincian={data?.rincian} />
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
                     {jenisDok?.key === 'rkpa' && (
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

function TableSubGiat({ subGiat = {} as any }: { subGiat: LaporanRinciBl['sub_kegiatan'] }) {
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
               <TrGiat label='Keluaran Sub Kegiatan'>
                  {output_bl_sub_giat?.map((item, i) => <div key={i}>{item.tolak_ukur}</div>)}
               </TrGiat>
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

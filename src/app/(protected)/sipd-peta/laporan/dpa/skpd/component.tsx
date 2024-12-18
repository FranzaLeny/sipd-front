'use client'

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getDpaSkpdFromSipd } from '@actions/penatausahaan/sipd/dpa'
import { getJadwaPergeseranDpaFromSipd } from '@actions/penatausahaan/sipd/jadwal'
import { getSkpdPenatausahaanFromSipd } from '@actions/penatausahaan/sipd/skpd'
import TanggalInput from '@components/form/tanggal-input'
import { TableAnggotaTapd, type Tapd } from '@components/master/tapd'
import TableCatatanRka from '@components/perencanaan/table-catatan-rka'
import Loading from '@components/ui/loading'
import {
   Autocomplete,
   AutocompleteItem,
   Button,
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownTrigger,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { numberToRupiah } from '@utils'
import { sumBy } from 'lodash-es'
import { Download, Printer, Settings } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'

type Props = {
   dataSkpd: SkpdTapdAnggaranBySkpd
   tahun: number
   id_skpd: number
   id_daerah: number
   token: string
}

const JENIS_DOKUMEN = {
   dppa: {
      name: 'DPPA',
      title: 'Dokumen Pelaksanaan dan Perubahan Anggaran',
      kode: 'DPPA',
      header:
         'Ringkasan Dokumen Pelaksanaan dan Perubahan Anggaran Pendapatan dan Belanja Daerah Satuan Kerja Perangkat Daerah',
   },
   dpa: {
      name: 'DPA',
      title: 'Dokumen Pelaksanaan Anggaran',
      kode: 'DPA',
      header:
         'Ringkasan Dokumen Pelaksanaan Anggaran Pendapatan dan Belanja Daerah Satuan Kerja Perangkat Daerah',
   },
   rdppa: {
      name: 'RDPPA',
      title: 'Rancangan Dokumen Pelaksanaan dan Perubahan Anggaran',
      kode: 'RDPPA',
      header:
         'Ringkasan Rancangan Dokumen Pelaksanaan dan Perubahan Anggaran Pendapatan dan Belanja Daerah Satuan Kerja Perangkat Daerah',
   },
   rdpa: {
      name: 'RDPA',
      title: 'Rancangan Dokumen Pelaksanaan Anggaran',
      kode: 'RDPA',
      header:
         'Ringkasan Rancangan Dokumen Pelaksanaan Anggaran Pendapatan dan Belanja Daerah Satuan Kerja Perangkat Daerah',
   },
   rka: {
      name: 'RKA',
      title: 'Rencana Kerja dan Anggaran',
      kode: 'RKA',
      header: 'Ringkasan Anggaran Pendapatan dan Belanja',
   },
   rkpa: {
      name: 'RKPA',
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
      header: 'Ringkasan Perubahan Anggaran Pendapatan dan Belanja',
   },
}

interface PropsTableRak {
   rincianRak: DpaSkpdPergeseranPeta['rincian']
   tanggal: string
   ibuKota: string
   jabatanKepala?: string | null
   pangkatKepala?: string
   namaKepalaSkpd: string
   nipKepalaSkpd: string
   namaPpkd: string
   nipPpkd: string
   kodeDok?: string
}

function TableRak(props: PropsTableRak) {
   const {
      rincianRak,
      tanggal,
      ibuKota,
      jabatanKepala,
      pangkatKepala,
      namaKepalaSkpd,
      namaPpkd,
      nipKepalaSkpd,
      nipPpkd,
      kodeDok,
   } = props
   const tanggalStr = (tanggal ? new Date(tanggal) : new Date()).toLocaleString('id', {
      dateStyle: 'long',
   })
   return (
      <div className='flex h-fit max-h-max'>
         <table className='min-w-[50%]'>
            <tbody>
               {Object.keys(rincianRak[0])?.map((i) => {
                  const key = i as keyof RakDpaSkpdPeta
                  return key === 'uraian' ? (
                     <tr
                        className='break-inside-avoid'
                        key={key}>
                        <td
                           colSpan={2}
                           className='cell-print bg-content1 p-2 text-center font-bold print:bg-slate-100'>
                           Rencana Realisasi Penerimaan per Bulan*) (Rp)
                        </td>
                        <td
                           colSpan={2}
                           className='cell-print bg-content1 p-2 text-center font-bold print:bg-slate-100'>
                           Rencana Realisasi Rencana Penarikan Dana per Bulan*) (Rp)
                        </td>
                     </tr>
                  ) : (
                     <tr
                        key={key}
                        className={`${key === 'jumlah' ? 'bg-content1 font-bold print:bg-slate-100' : ''} break-inside-avoid`}>
                        {rincianRak?.map((item, j) => {
                           const value = item[key]
                           return (
                              <Fragment key={key + '-' + j}>
                                 <td className='cell-print p-2 text-left capitalize'>{key}</td>
                                 <td className='cell-print p-2 text-right'>
                                    {numberToRupiah(value)}
                                 </td>
                              </Fragment>
                           )
                        })}
                     </tr>
                  )
               })}
            </tbody>
         </table>
         <div className='flex w-1/2 flex-col gap-4'>
            <div className='break-inside-avoid p-2 text-center align-middle'>
               <div className='mx-auto flex w-fit gap-1'>
                  {ibuKota},{'  '}
                  <TanggalInput
                     defaultValue={tanggalStr}
                     kode={kodeDok}
                  />
               </div>
               <div>{jabatanKepala}</div>
               <div className='h-20' />
               <div className='font-bold underline'>{namaKepalaSkpd}</div>
               {pangkatKepala && <div>{pangkatKepala}</div>}
               <div>NIP. {nipKepalaSkpd}</div>
            </div>
            {!kodeDok?.startsWith('R') && (
               <div className='break-inside-avoid text-center align-middle'>
                  <div>Mengesahkan</div>
                  <div>PPKD</div>
                  <div className='h-20' />
                  <div className='font-bold underline'>{namaPpkd}</div>
                  <div>NIP. {nipPpkd}</div>
               </div>
            )}
         </div>
      </div>
   )
}

interface PropsTableKop {
   dokumen: {
      name: string
      title: string
      kode: string
      header: string
   }
   tahun: number | string
   nomorDpa: string
   kodeSkpd: string
   namaSkpd: string
}

function TableKop(props: PropsTableKop) {
   const { dokumen, tahun, kodeSkpd, nomorDpa, namaSkpd } = props
   const firstPartNorDpa = nomorDpa?.split('/')[0]
   return (
      <table className='min-w-full font-bold'>
         <tbody>
            <tr className='text-center uppercase'>
               <td
                  colSpan={3}
                  className='cell-print'>
                  <div>{dokumen?.title}</div>
                  <div>SATUAN KERJA PERANGKAT DAERAH</div>
               </td>
               <td
                  className='cell-print  w-0'
                  rowSpan={4}>
                  {dokumen?.kode} REKAPITULASI SKPD
               </td>
            </tr>
            <tr className='text-center uppercase'>
               <td
                  colSpan={3}
                  className='cell-print'>
                  <div>PEMERINTAH KABUPATEN LEMBATA</div>
                  <div>TAHUN ANGGARAN {tahun}</div>
               </td>
            </tr>
            <tr className='border-print'>
               <td className='pl-2'>Nomor</td>
               <td>:</td>
               <td className='pr-2'>{nomorDpa?.replace(firstPartNorDpa, dokumen?.kode)}</td>
            </tr>
            <tr className='border-print'>
               <td className='pl-2'>Organisasi</td>
               <td>:</td>
               <td className='pr-2'>
                  {kodeSkpd} {namaSkpd}
               </td>
            </tr>
            <tr className='h-2'></tr>
            <tr className='text-center font-bold'>
               <td
                  colSpan={4}
                  className='cell-print'>
                  {dokumen?.header}
               </td>
            </tr>
         </tbody>
      </table>
   )
}

function TableRincian({ dpaSkpd }: { dpaSkpd?: DpaSkpdPeta }) {
   const summary = useMemo(() => {
      if (!!dpaSkpd) {
         const totalBelanja = sumBy(dpaSkpd?.ringkasan_belanja, (o) =>
            o.kode_akun?.length > 3 ? o.nilai : 0
         )
         const totalPendapatan = sumBy(dpaSkpd?.ringkasan_pendapatan, (o) =>
            o.kode_akun?.length > 3 ? o.nilai : 0
         )
         const selisih = totalPendapatan - totalBelanja
         const stringSelish = numberToRupiah(Math.abs(selisih))
         return {
            belanja: numberToRupiah(totalBelanja),
            pendapatan: numberToRupiah(totalPendapatan),
            selisih: selisih >= 0 ? stringSelish : `(${stringSelish})`,
         }
      } else {
         return undefined
      }
   }, [dpaSkpd])
   return (
      <table className='min-w-full'>
         <thead className='bg-content1 text-center font-bold print:bg-slate-100'>
            <tr>
               <th
                  colSpan={3}
                  className='cell-print w-0'>
                  Kode Rekening
               </th>
               <th className='cell-print w-0'>Uraian</th>
               <th className='cell-print w-0'>Jumlah (Rp)</th>
            </tr>
         </thead>
         <tbody>
            {dpaSkpd?.ringkasan_pendapatan.map((i, index) => {
               const kode = i?.kode_akun?.split('.')
               return (
                  <tr
                     key={i.kode_akun + index}
                     className={i.kode_akun.length > 3 ? '' : 'font-bold'}>
                     <td className='cell-print w-0'>{kode[0]}</td>
                     <td className='cell-print w-0'>{kode[1]}</td>
                     <td className='cell-print w-0'>{kode[2]}</td>
                     <td className='cell-print p-2'>{i.uraian}</td>
                     <td className='cell-print  p-2 text-right'>{numberToRupiah(i.nilai)}</td>
                  </tr>
               )
            })}
            <tr className='print:bg-content1 bg-content1 text-right font-bold'>
               <td
                  colSpan={4}
                  className='cell-print'>
                  Jumlah Pendapatan
               </td>
               <td className='cell-print'>{summary?.pendapatan}</td>
            </tr>
            {dpaSkpd?.ringkasan_belanja?.map((i, index) => {
               const kode = i?.kode_akun?.split('.')
               return (
                  <tr
                     key={i.kode_akun + index}
                     className={i.kode_akun.length > 3 ? '' : 'font-bold'}>
                     <td className='cell-print w-0'>{kode[0]}</td>
                     <td className='cell-print w-0'>{kode[1]}</td>
                     <td className='cell-print w-0'>{kode[2]}</td>
                     <td className='cell-print p-2'>{i.uraian}</td>
                     <td className='cell-print p-2 text-right'>{numberToRupiah(i.nilai)}</td>
                  </tr>
               )
            })}
            <tr className='bg-content1 text-right font-bold print:bg-slate-100'>
               <td
                  colSpan={4}
                  className='cell-print'>
                  Jumlah Belanja
               </td>
               <td className='cell-print'>{summary?.belanja}</td>
            </tr>
            <tr className='bg-content1 text-right font-bold print:bg-slate-100'>
               <td
                  colSpan={4}
                  className='cell-print'>
                  Total Surplus/(Defisit)
               </td>
               <td className='cell-print'>{summary?.selisih}</td>
            </tr>
            <tr className='bg-content1 text-right font-bold print:bg-slate-100'>
               <td
                  colSpan={4}
                  className='cell-print'>
                  Jumlah Penerimaan Pembiayaan
               </td>
               <td className='cell-print'>Rp0</td>
            </tr>
            <tr className='bg-content1 text-right font-bold print:bg-slate-100'>
               <td
                  colSpan={4}
                  className='cell-print'>
                  Jumlah Pengeluaran Pembiayaan
               </td>
               <td className='cell-print'>Rp0</td>
            </tr>
            <tr className='bg-content1 text-right font-bold print:bg-slate-100'>
               <td
                  colSpan={4}
                  className='cell-print'>
                  Pembiayaan Neto
               </td>
               <td className='cell-print'>Rp0</td>
            </tr>
         </tbody>
      </table>
   )
}

function TableRincianPergeseran({ dpaSkpd }: { dpaSkpd: DpaSkpdPergeseranPeta }) {
   return (
      <table className='min-w-full'>
         <thead className='bg-content1 text-center font-bold print:bg-slate-100'>
            <tr>
               <th
                  colSpan={3}
                  rowSpan={2}
                  className='cell-print w-0'>
                  Kode Rekening
               </th>
               <th
                  rowSpan={2}
                  className='cell-print w-0'>
                  Uraian
               </th>
               <th
                  colSpan={2}
                  className='cell-print w-0'>
                  Jumlah (Rp)
               </th>
               <th
                  rowSpan={2}
                  className='cell-print w-0'>
                  Bertambah (Berkurang) (Rp)
               </th>
            </tr>
            <tr>
               <th className='cell-print w-0'>Sebelum</th>
               <th className='cell-print w-0'>Setelah</th>
            </tr>
         </thead>
         <tbody>
            {dpaSkpd?.rincian_pergeseran?.map((item, i) => {
               const selisih = (item?.setelah_nilai || 0) - (item?.sebelum_nilai || 0)
               const strSelisih = numberToRupiah(Math.abs(selisih))
               const kode = item?.kode_akun?.split('.')
               return (
                  <tr
                     key={item?.kode_akun + i}
                     className={item.kode_akun.length > 3 ? '' : 'font-bold'}>
                     <td className='cell-print w-0'>{kode[0]}</td>
                     <td className='cell-print w-0'>{kode[1]}</td>
                     <td className='cell-print w-0'>{kode[2]}</td>
                     <td className='cell-print'>{item?.uraian}</td>
                     <td className='cell-print w-0 text-right'>
                        {numberToRupiah(item?.sebelum_nilai)}
                     </td>
                     <td className='cell-print w-0 text-right'>
                        {numberToRupiah(item?.setelah_nilai)}
                     </td>
                     <td className='cell-print w-0 text-right'>
                        {selisih >= 0 ? strSelisih : `(${strSelisih})`}
                     </td>
                  </tr>
               )
            })}
         </tbody>
      </table>
   )
}

export default function DpaSkpd({
   id_daerah = 0,
   id_skpd = 0,
   tahun = 0,
   dataSkpd: { sub_skpd, tapd: _tapd },
}: Props) {
   const [tapd, setTapd] = useState<Tapd[] | undefined>(_tapd ?? undefined)
   const [skpd, setSkpd] = useState<any>(id_skpd?.toString() ?? '')
   const [jadwal, setJadwal] = useState<any>('')
   const [dokumen, setDokumen] = useState<(typeof JENIS_DOKUMEN)['dppa'] | undefined>()
   const [disableKeysDok, setDisableKeysDok] = useState<string[]>([])

   const { data: listSkpd, isFetching: loadingSkpd } = useQuery({
      queryKey: [id_daerah, tahun, 'getSkpdPenatausahaanFromSipd'],
      queryFn: ({ queryKey: [id_daerah, tahun] }) =>
         getSkpdPenatausahaanFromSipd({ id_daerah, tahun }),
      enabled: !!id_daerah && !!tahun,
   })
   const { data: listJadwal, isFetching: loadingJadwal } = useQuery({
      queryKey: ['getJadwaPergeseranDpaFromSipd'],
      queryFn: () => getJadwaPergeseranDpaFromSipd(),
   })

   const { data: dpaSkpd, isFetching } = useQuery({
      queryKey: [jadwal, skpd, 'getDpaSkpdFromSipd'],
      queryFn: ({ queryKey: [id_jadwal, id_skpd] }) => getDpaSkpdFromSipd({ id_jadwal, id_skpd }),
      enabled: !!jadwal && !!skpd,
   })

   useEffect(() => {
      if (listSkpd && listSkpd[0]?.id_skpd.toString() !== skpd) {
         setSkpd(listSkpd[0]?.id_skpd.toString())
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [listSkpd])

   useEffect(() => {
      if (dpaSkpd?.tipe_q) {
         dpaSkpd.tipe_q === 'OLD' ? setDokumen(JENIS_DOKUMEN.dpa) : setDokumen(JENIS_DOKUMEN.dppa)
         dpaSkpd.tipe_q === 'NEW'
            ? setDisableKeysDok(['RDPA', 'DPA', 'RKA'])
            : setDisableKeysDok(['RDPPA', 'DPPA', 'RKPA'])
      } else {
         setDokumen(undefined)
      }
   }, [dpaSkpd?.tipe_q])

   const { jabatanKepala, pangkatKepala } = useMemo(() => {
      return {
         jabatanKepala: sub_skpd?.nama_jabatan_kepala || 'KEPALA SKPD',
         pangkatKepala: sub_skpd?.pangkat_kepala || undefined,
      }
   }, [sub_skpd?.pangkat_kepala, sub_skpd?.nama_jabatan_kepala])

   const documentTitle = useMemo(() => {
      let text = 'RKA_03_SKPD'
      if (!!dpaSkpd && !!dokumen) {
         text =
            (dokumen.kode + '_' + dpaSkpd?.kode_skpd?.substring(0, 6) + '_' + dpaSkpd?.nama_skpd)
               ?.substring(0, 120)
               ?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '_03_SKPD'
      }
      return text
   }, [dpaSkpd, dokumen])

   const printRef = useRef(null)
   const handlePrint = useReactToPrint({
      content: () => printRef.current,
      documentTitle,
   })
   const handleExport = useCallback(() => {
      toast.warning('Export excel dalam pengembangan')
   }, [])

   return (
      <>
         {(isFetching || loadingSkpd || loadingJadwal) && (
            <Loading className='absolute inset-0 z-50 size-full' />
         )}
         <div className='content sticky left-0 space-y-3 pt-4'>
            <Autocomplete
               listboxProps={{ emptyContent: 'Tidak ada data SKPD' }}
               isInvalid={!skpd}
               variant='bordered'
               isLoading={loadingSkpd}
               label='Pilih SKPD'
               selectedKey={skpd}
               onSelectionChange={setSkpd}
               items={listSkpd || []}>
               {(item) => (
                  <AutocompleteItem
                     startContent={item.kode_skpd}
                     key={item.id_skpd}>
                     {item?.nama_skpd}
                  </AutocompleteItem>
               )}
            </Autocomplete>
            <Autocomplete
               listboxProps={{ emptyContent: 'Tidak ada data Jadwal' }}
               isInvalid={!jadwal}
               variant='bordered'
               isLoading={loadingJadwal}
               label='Pilih Jadwal'
               selectedKey={jadwal}
               onSelectionChange={setJadwal}
               items={listJadwal || []}>
               {(item) => (
                  <AutocompleteItem
                     key={item.id_jadwal}
                     value={item?.jadwal_sipd_penatausahaan}>
                     {item?.jadwal_sipd_penatausahaan}
                  </AutocompleteItem>
               )}
            </Autocomplete>
         </div>
         {!!dpaSkpd && !!dokumen && (
            <>
               <div className='top-navbar content sticky left-1/2 flex w-fit -translate-x-1/2 gap-4 rounded-b-2xl py-4 backdrop-blur-sm'>
                  <Dropdown>
                     <DropdownTrigger>
                        <Button
                           variant='bordered'
                           color='secondary'
                           startContent={<Settings className='size-5' />}
                           className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
                           isDisabled={!!!dpaSkpd || isFetching}>
                           <span className='hidden sm:inline-flex'>
                              {dokumen?.name ? 'Nama Dokumen : ' + dokumen?.name : 'Nama Dokumen'}
                           </span>
                        </Button>
                     </DropdownTrigger>
                     <DropdownMenu
                        selectionMode='single'
                        selectedKeys={dokumen ? [dokumen?.kode] : []}
                        disabledKeys={dokumen ? [dokumen?.kode] : []}
                        items={Object.values(JENIS_DOKUMEN)?.filter(
                           (d) => !disableKeysDok.includes(d?.kode)
                        )}>
                        {(item) => (
                           <DropdownItem
                              onPress={() => setDokumen(item)}
                              key={item?.kode}>
                              {item?.name}
                           </DropdownItem>
                        )}
                     </DropdownMenu>
                  </Dropdown>
                  <Button
                     endContent={<Printer className='size-5' />}
                     className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
                     color='primary'
                     onPress={handlePrint}
                     isDisabled={isFetching}>
                     <span className='hidden sm:inline-flex'>Cetak</span>
                  </Button>
                  <Button
                     endContent={<Download className='size-5' />}
                     className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
                     color='primary'
                     onPress={handleExport}
                     isDisabled={isFetching}>
                     <span className='hidden sm:inline-flex'>Export Excel</span>
                  </Button>
               </div>
               <div className='content pb-10'>
                  <div
                     ref={printRef}
                     className='page-print w-fit min-w-full max-w-max'>
                     <TableKop
                        dokumen={dokumen}
                        tahun={tahun}
                        kodeSkpd={dpaSkpd?.kode_skpd}
                        nomorDpa={dpaSkpd?.nomor_dpa}
                        namaSkpd={dpaSkpd?.nama_skpd}
                     />
                     <div className='h-2' />
                     {dpaSkpd?.tipe_q === 'NEW' ? (
                        <TableRincianPergeseran dpaSkpd={dpaSkpd} />
                     ) : (
                        <TableRincian dpaSkpd={dpaSkpd} />
                     )}
                     <div className='h-2' />
                     {!!dpaSkpd?.rincian.length && (
                        <TableRak
                           rincianRak={dpaSkpd?.rincian}
                           tanggal={dpaSkpd?.tanggal}
                           ibuKota={dpaSkpd.nama_ibu_kota}
                           jabatanKepala={jabatanKepala}
                           pangkatKepala={pangkatKepala}
                           namaKepalaSkpd={dpaSkpd?.nama_kepala_skpd}
                           nipKepalaSkpd={dpaSkpd?.nip_kepala_skpd}
                           namaPpkd={dpaSkpd?.nama_ppkd}
                           nipPpkd={dpaSkpd?.nip_ppkd}
                           kodeDok={dokumen?.kode}
                        />
                     )}
                     <div className='h-2' />
                     {(dokumen?.kode === 'RKA' || dokumen?.kode === 'RKPA') && (
                        <>
                           <TableCatatanRka printPreview />
                           <div className='h-2' />
                        </>
                     )}
                     <TableAnggotaTapd
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

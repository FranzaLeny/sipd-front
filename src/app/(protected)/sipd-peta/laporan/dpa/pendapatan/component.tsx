'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ResponseSkpdTapdAnggaranBySkpd } from '@actions/perencanaan/data/skpd'
import TanggalInput from '@components/form/tanggal-input'
import { TableAnggotaTapd, Tapd } from '@components/master/tapd'
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
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'
import { useSipdPetaFetcher } from '@shared/hooks/use-sipd-peta-fetcher'

import dowloadRkaPendapatan from './export-excel-pendapatan-perubahan'

interface DpaPendapatanPeta {
   tipe_q: 'OLD' | 'NEW'
   nama_ibu_kota: string
   nomor_dpa: string
   tanggal: string
   nama_skpd: string
   kode_skpd: string
   nama_kepala_skpd: string
   nip_kepala_skpd: string
   nama_ppkd: string
   nip_ppkd: string
   ringkasan: Ringkasan[]
   ringkasan_pergeseran: Ringkasanpergeseran[]
   rincian: Rincian[]
}
interface SkpdPeta {
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
}
interface JadwalPergeseran {
   tahapan: string
   jadwal_sipd_penatausahaan: string
   id_tahap_sipd: string
   is_locked: number
   id_jadwal: number
   id_jadwal_sipd: number
}

interface Rincian {
   uraian: string
   januari: number
   februari: number
   maret: number
   april: number
   mei: number
   juni: number
   juli: number
   agustus: number
   september: number
   oktober: number
   november: number
   desember: number
   jumlah: number
}

interface Ringkasan {
   kode_akun: string
   uraian: string
   volume: number
   satuan: string
   koefisien: string
   nilai: number
}
interface Ringkasanpergeseran {
   kode_rekening: string
   sebelum_uraian: string
   setelah_uraian: string
   sebelum_volume: number
   setelah_volume: number
   sebelum_satuan: string
   setelah_satuan: string
   sebelum_koefisien: string
   setelah_koefisien: string
   sebelum_nilai: number
   setelah_nilai: number
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
      header: 'Rincian Anggaran Pendapatan',
   },
   rkpa: {
      name: 'RKPA',
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
      header: 'Rincian Perubahan Anggaran Pendapatan',
   },
}

interface PropsTableRak {
   rincianRak: DpaPendapatanPeta['rincian']
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
      rincianRak: [item],
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
   const tanggalStr = (!!tanggal ? new Date(tanggal) : new Date()).toLocaleString('id', {
      dateStyle: 'long',
   })
   return (
      <div className='flex h-fit max-h-max leading-snug'>
         <table className='min-w-[50%]'>
            <tbody>
               {Object.keys(item)?.map((i) => {
                  const key = i as keyof Rincian
                  const value = item[key]
                  return key === 'uraian' ? (
                     <tr
                        className='break-inside-avoid'
                        key={key}>
                        <td
                           colSpan={2}
                           className='cell-print bg-content1 p-2 text-center font-bold print:bg-slate-100'>
                           Rencana Realisasi Pendapatan per Bulan*) (Rp)
                        </td>
                     </tr>
                  ) : (
                     <tr
                        key={key}
                        className={`${key === 'jumlah' ? 'bg-content1 font-bold print:bg-slate-100' : ''} break-inside-avoid`}>
                        <td className='cell-print p-2 text-left capitalize'>{key}</td>
                        <td className='cell-print p-2 text-right'>
                           {value?.toLocaleString('id', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                           })}
                        </td>
                     </tr>
                  )
               })}
            </tbody>
         </table>
         <div className='flex w-1/2 flex-col gap-4'>
            <div className='break-inside-avoid p-2 text-center align-middle'>
               <div className='mx-auto flex w-fit gap-1'>
                  {ibuKota},{' '}
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
                  className='cell-print px-3'
                  rowSpan={4}>
                  <div>Formuilr</div>
                  <div className='whitespace-nowrap'>{dokumen?.kode} - PENDAPATAN</div>
                  <div>SKPD</div>
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

function TableRincian({ ringkasan }: { ringkasan: DpaPendapatanPeta['ringkasan'] }) {
   const [jumlah, ...data] = ringkasan
   return (
      <table className='min-w-full leading-snug'>
         <thead className='bg-content1 break-inside-avoid text-center font-bold print:bg-slate-100'>
            <tr>
               <th
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
                  colSpan={3}
                  className='cell-print w-0'>
                  Rincian Perhitungan
               </th>
               <th
                  rowSpan={2}
                  className='cell-print w-0'>
                  Jumlah (Rp)
               </th>
            </tr>

            <tr>
               <th className='cell-print w-0'>Volume</th>
               <th className='cell-print w-0'>Satuan</th>
               <th className='cell-print w-0'>Tarif/ Harga</th>
            </tr>
         </thead>
         <tbody>
            {data.map((item) => {
               const isRinci = !!item.satuan || !!item?.koefisien
               return (
                  <tr className={`break-inside-avoid ${isRinci ? '' : 'font-bold'}`}>
                     <td className='cell-print w-0'>{item.kode_akun}</td>
                     <td
                        colSpan={isRinci ? 1 : 4}
                        className='cell-print p-2'>
                        {item.uraian}
                     </td>
                     {isRinci && (
                        <>
                           <td className='cell-print p-2'>{item.volume}</td>
                           <td className='cell-print p-2'>{item.satuan}</td>
                           <td className='cell-print p-2'>{item.koefisien}</td>
                        </>
                     )}

                     <td className='cell-print  p-2 text-right'>
                        {item.nilai?.toLocaleString('id-ID', {
                           maximumFractionDigits: 0,
                           style: 'currency',
                           currency: 'IDR',
                        })}
                     </td>
                  </tr>
               )
            })}
            <tr className='print:bg-content1 break-inside-avoid bg-slate-100 text-right font-bold'>
               <td
                  colSpan={5}
                  className='cell-print'>
                  Jumlah
               </td>
               <td className='cell-print'>
                  {jumlah?.nilai?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
            </tr>
         </tbody>
      </table>
   )
}

type Props = {
   dataSkpd: ResponseSkpdTapdAnggaranBySkpd
   tahun: number
   id_skpd: number
   id_daerah: number
   token: string
}

function TableRincianPergeseran({
   ringkasan,
}: {
   ringkasan: DpaPendapatanPeta['ringkasan_pergeseran']
}) {
   const [jumlah, ...other] = ringkasan
   const data = [...other, jumlah]
   return (
      <table className='min-w-full leading-snug'>
         <thead className='bg-content1 break-inside-avoid text-center font-bold print:bg-slate-100'>
            <tr>
               <th
                  rowSpan={3}
                  className='cell-print w-0'>
                  Kode Rekening
               </th>
               <th
                  colSpan={5}
                  className='cell-print w-0'>
                  Sebelum
               </th>
               <th
                  colSpan={5}
                  className='cell-print w-0'>
                  Setelah
               </th>
               <th
                  rowSpan={3}
                  className='cell-print w-0'>
                  Bertambah (Berkurang) (Rp)
               </th>
            </tr>

            <tr>
               <th
                  rowSpan={2}
                  className='cell-print w-0'>
                  Uraian
               </th>
               <th
                  colSpan={3}
                  className='cell-print w-0'>
                  Rincian
               </th>
               <th
                  rowSpan={2}
                  className='cell-print w-0'>
                  Jumlah (Rp)
               </th>
               <th
                  rowSpan={2}
                  className='cell-print w-0'>
                  Uraian
               </th>
               <th
                  colSpan={3}
                  className='cell-print w-0'>
                  Rincian
               </th>
               <th
                  rowSpan={2}
                  className='cell-print w-0'>
                  Jumlah (Rp)
               </th>
            </tr>
            <tr>
               <th className='cell-print w-0'>Volume</th>
               <th className='cell-print w-0'>Satuan</th>
               <th className='cell-print w-0'>Tarif/ Harga</th>
               <th className='cell-print w-0'>Volume</th>
               <th className='cell-print w-0'>Satuan</th>
               <th className='cell-print w-0'>Tarif/ Harga</th>
            </tr>
         </thead>
         <tbody>
            {data?.map((item, i) => {
               const selisih = (item?.setelah_nilai || 0) - (item?.sebelum_nilai || 0)
               const isRinci = !!item?.sebelum_koefisien || !!item?.setelah_koefisien
               const strSelisih = Math.abs(selisih)?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
               })
               return (
                  <tr
                     key={item?.kode_rekening + i}
                     className={`break-inside-avoid ${!!isRinci ? '' : 'font-bold'}`}>
                     {item?.kode_rekening === '1' ? (
                        <>
                           <td
                              colSpan={4}
                              className='cell-print text-right'>
                              Jumlah
                           </td>
                        </>
                     ) : (
                        <>
                           <td className='cell-print w-0'>{item.kode_rekening}</td>
                           <>
                              <td
                                 colSpan={isRinci ? 1 : 4}
                                 className='cell-print'>
                                 {item?.sebelum_uraian}
                              </td>
                              {isRinci && (
                                 <>
                                    <td className='cell-print'>{item?.sebelum_volume}</td>
                                    <td className='cell-print'>{item?.sebelum_satuan}</td>
                                    <td className='cell-print'>{item?.sebelum_koefisien}</td>
                                 </>
                              )}
                           </>
                        </>
                     )}
                     <td className='cell-print text-right'>
                        {item?.sebelum_nilai?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     {item?.kode_rekening === '1' ? (
                        <>
                           <td
                              colSpan={5}
                              className='cell-print text-right'>
                              Jumlah
                           </td>
                        </>
                     ) : (
                        <>
                           <td
                              colSpan={isRinci ? 1 : 4}
                              className='cell-print'>
                              {item?.setelah_uraian}
                           </td>
                           {isRinci && (
                              <>
                                 <td className='cell-print'>{item?.setelah_volume}</td>
                                 <td className='cell-print'>{item?.setelah_satuan}</td>
                                 <td className='cell-print'>{item?.setelah_koefisien}</td>
                              </>
                           )}
                        </>
                     )}
                     <td className='cell-print text-right'>
                        {item?.setelah_nilai?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
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

export default function DpaPendapatanSkpd({
   id_daerah = 0,
   id_skpd = 0,
   tahun = 0,
   token = '',
   dataSkpd: { sub_skpd, tapd: _tapd },
}: Props) {
   const [tapd, setTapd] = useState<Tapd[] | undefined>(_tapd ?? undefined)
   const [skpd, setSkpd] = useState<any>(id_skpd?.toString() ?? '')
   const [jadwal, setJadwal] = useState<any>('')
   const [dokumen, setDokumen] = useState<(typeof JENIS_DOKUMEN)['dppa'] | undefined>()
   const [disableKeysDok, setDisableKeysDok] = useState<string[]>([])

   const { data: listSkpd, isFetching: loadingSkpd } = useSipdPetaFetcher<SkpdPeta[]>({
      token,
      url: `https://service.sipd.kemendagri.go.id/referensi/strict/skpd/list/${id_daerah}/${tahun}`,
      enabled: !!id_daerah && !!tahun,
   })

   const { data: listJadwal, isFetching: loadingJadwal } = useSipdPetaFetcher<JadwalPergeseran[]>({
      token,
      url: `https://service.sipd.kemendagri.go.id/referensi/strict/laporan/dpa/dpa/jadwal-pergeseran`,
      enabled: !!token,
   })

   const { data: dpaSkpd, isFetching } = useSipdPetaFetcher<DpaPendapatanPeta>({
      token,
      url: `https://service.sipd.kemendagri.go.id/referensi/strict/laporan/dpa/dpa/pendapatan/${skpd}/${jadwal}`,
      enabled: !!jadwal && !!skpd,
   })

   useEffect(() => {
      if (listSkpd && listSkpd[0]?.id_skpd.toString() !== skpd) {
         setSkpd(listSkpd[0]?.id_skpd.toString())
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [listSkpd])

   useEffect(() => {
      if (dpaSkpd) {
         dpaSkpd.tipe_q === 'OLD' ? setDokumen(JENIS_DOKUMEN.dpa) : setDokumen(JENIS_DOKUMEN.dppa)
         dpaSkpd.tipe_q === 'NEW'
            ? setDisableKeysDok(['RDPA', 'DPA', 'RKA'])
            : setDisableKeysDok(['RDPPA', 'DPPA', 'RKPA'])
      } else {
         setDokumen(undefined)
      }
   }, [dpaSkpd])

   const { jabatanKepala, pangkatKepala } = useMemo(() => {
      return {
         jabatanKepala: sub_skpd?.nama_jabatan_kepala || 'KEPALA SKPD',
         pangkatKepala: sub_skpd?.pangkat_kepala || undefined,
      }
   }, [sub_skpd?.pangkat_kepala, sub_skpd?.nama_jabatan_kepala])

   const documentTitle = useMemo(() => {
      let text = 'RKA_04_PENDAPATAN'
      if (!!dpaSkpd && dokumen) {
         text =
            (dokumen.kode + '_' + dpaSkpd?.kode_skpd?.substring(0, 6) + '_' + dpaSkpd?.nama_skpd)
               ?.substring(0, 120)
               ?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '_04_PENDAPATAN'
      }
      return text
   }, [dpaSkpd, dokumen])

   const printRef = useRef(null)

   const handlePrint = useReactToPrint({
      content: () => printRef.current,
      documentTitle,
   })

   const handleExport = useCallback(() => {
      if (!dokumen || !dpaSkpd) {
         toast.error('Tidak ada data yang tersedia')
         return
      }
      const {
         ringkasan_pergeseran: items,
         rincian: rak,
         ringkasan,
         tipe_q,
         ...skpdSettings
      } = dpaSkpd
      const isPerubahan = tipe_q === 'NEW'
      if (isPerubahan) {
         dowloadRkaPendapatan({
            dokumen,
            items,
            jabatanKepala,
            rak,
            skpdSettings,
            tahun,
            pangkatKepala,
            tapd,
         })
      } else {
         toast.warning('Export excel dalam pengembangan')
      }
   }, [dpaSkpd, dokumen, jabatanKepala, pangkatKepala, tahun, tapd])

   return (
      <>
         {(isFetching || loadingSkpd || loadingJadwal) && (
            <Loading className='absolute inset-0 z-50 size-full' />
         )}
         <div className='content sticky left-0 space-y-3 pt-4'>
            <Autocomplete
               isInvalid={!skpd}
               isLoading={loadingSkpd}
               label='Pilih SKPD'
               selectedKey={skpd}
               variant='bordered'
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
               isInvalid={!jadwal}
               isLoading={loadingJadwal}
               label='Pilih Jadwal'
               selectedKey={jadwal}
               variant='bordered'
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
                           isDisabled={!!!dpaSkpd || isFetching}>
                           {dokumen?.name ? 'Nama Dokumen : ' + dokumen?.name : 'Nama Dokumen'}
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
                     color='primary'
                     onPress={handlePrint}
                     isDisabled={isFetching}>
                     Cetak
                  </Button>
                  <Button
                     color='secondary'
                     onPress={handleExport}
                     isDisabled={isFetching}>
                     Export Excel
                  </Button>
               </div>
               <div className='content pb-10 text-base'>
                  <div
                     ref={printRef}
                     className='w-fit min-w-full max-w-max print:bg-white print:text-black'>
                     <TableKop
                        dokumen={dokumen}
                        tahun={tahun}
                        kodeSkpd={dpaSkpd?.kode_skpd}
                        nomorDpa={dpaSkpd?.nomor_dpa}
                        namaSkpd={dpaSkpd?.nama_skpd}
                     />
                     <div className='h-2' />
                     {dpaSkpd?.tipe_q === 'NEW' ? (
                        <TableRincianPergeseran ringkasan={dpaSkpd?.ringkasan_pergeseran} />
                     ) : (
                        <TableRincian ringkasan={dpaSkpd?.ringkasan} />
                     )}
                     <div className='h-2' />
                     {!!dpaSkpd?.rincian.length && (
                        <TableRak
                           rincianRak={dpaSkpd?.rincian}
                           tanggal={dpaSkpd?.tanggal}
                           ibuKota={dpaSkpd?.nama_ibu_kota}
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

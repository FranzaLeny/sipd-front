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

import dowloadRkaBelanja from './export-excel-belanja-perubahan'

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

interface DpaBelanja {
   tipe_q: string
   nama_ibu_kota: string
   nomor_dpa: string
   tanggal: string
   nama_skpd: string
   kode_skpd: string
   nama_kepala_skpd: string
   nip_kepala_skpd: string
   nama_ppkd: string
   nip_ppkd: string
   index: Index[]
   index_pergeseran: Indexpergeseran[]
   rak: Rak[]
}

interface Rak {
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

interface Index {
   kode_akun: string
   uraian: string
   sumber_dana: string
   lokasi: string
   t1: string
   bel_operasi: number
   bel_modal: number
   bel_btt: number
   bel_transfer: number
   jumlah: number
   t2: string
}

interface Indexpergeseran {
   kode_rekening: string
   uraian: string
   sumber_dana: string
   lokasi: string
   t1: string
   sebelum_bel_operasi: number
   sebelum_bel_modal: number
   sebelum_bel_btt: number
   sebelum_bel_transfer: number
   sebelum_jumlah: number
   setelah_bel_operasi: number
   setelah_bel_modal: number
   setelah_bel_btt: number
   setelah_bel_transfer: number
   setelah_jumlah: number
   bertambah_berkurang: number
   t2: string
}
type Props = {
   tahun: number
   id_skpd: number
   id_daerah: number
   id_unit: number
   token: string
   dataSkpd: ResponseSkpdTapdAnggaranBySkpd
}

const JENIS_DOKUMEN = {
   dppa: {
      name: 'DPPA',
      title: 'Dokumen Pelaksanaan dan Perubahan Anggaran',
      kode: 'DPPA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan dan Perubahan Belanja Berdasarkan Program, Kegiatan, dan Sub Kegiatan',
   },
   dpa: {
      name: 'DPA',
      title: 'Dokumen Pelaksanaan Anggaran',
      kode: 'DPA',
      header:
         'Rekapitulasi Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, dan Sub Kegiatan',
   },

   rdppa: {
      name: 'RDPPA',
      title: 'Rancangan Dokumen Pelaksanaan dan Perubahan Anggaran',
      kode: 'RDPPA',
      header:
         'Rekapitulasi Rancangan Dokumen Pelaksanaan dan Perubahan Belanja Berdasarkan Program, Kegiatan, dan Sub Kegiatan',
   },
   rdpa: {
      name: 'RDPA',
      title: 'Rancangan Dokumen Pelaksanaan Anggaran',
      kode: 'RDPA',
      header:
         'Rekapitulasi Rancangan Dokumen Pelaksanaan Belanja Berdasarkan Program, Kegiatan, dan Sub Kegiatan',
   },
   rka: {
      name: 'RKA',
      title: 'Rencana Kerja dan Anggaran',
      kode: 'RKA',
      header: 'Rincian Anggaran Belanja Berdasarkan Program dan Kegiatan',
   },
   rkpa: {
      name: 'RKPA',
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
      header: 'Rincian Perubahan Anggaran Belanja Berdasarkan Program dan Kegiatan',
   },
}

interface PropsTableRak {
   rak: DpaBelanja['rak']
   tanggal: string
   ibuKota: string
   jabatanKepala?: string | null
   pangkatKepala?: string | null
   namaKepalaSkpd: string
   nipKepalaSkpd: string
   namaPpkd: string
   nipPpkd: string
   kodeDok?: string
}

function TableRak(props: PropsTableRak) {
   const {
      rak: [item],
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
      <div className='border-divider flex h-fit max-h-max border-collapse overflow-hidden border-r '>
         <table className='min-w-[50%] leading-snug'>
            <tbody>
               {Object.keys(item)?.map((i) => {
                  const key = i as keyof Rak
                  const value = item[key]
                  return key === 'uraian' ? (
                     <tr
                        className='break-inside-avoid'
                        key={key}>
                        <td
                           colSpan={2}
                           className='cell-print bg-content1 p-2 text-center font-bold print:bg-slate-100'>
                           Rencana Realisasi Belanja per Bulan*) (Rp)
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
         <div className='flex w-1/2 flex-col gap-4 print:text-lg'>
            <div className='break-inside-avoid p-2 text-center align-middle'>
               <div className='mx-auto flex w-fit gap-1'>
                  {ibuKota},
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
                  <div>Formuilr</div>
                  <div className='whitespace-nowrap'>{dokumen?.kode} - BELANJA</div>
                  <div>SKPD</div>
               </td>
            </tr>
            <tr className='text-center uppercase'>
               <td
                  colSpan={3}
                  className='cell-print px-3'>
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

function TableRincian({ data }: { data: DpaBelanja['index'] }) {
   return (
      <table className='min-w-full leading-snug'>
         <thead className='bg-content1 break-inside-avoid text-center font-bold print:bg-slate-100'>
            <tr>
               <th
                  rowSpan={3}
                  className='cell-print text-vertical w-0'>
                  Urusan
               </th>
               <th
                  rowSpan={3}
                  className='cell-print text-vertical w-0'>
                  Bidang Urusan
               </th>
               <th
                  rowSpan={3}
                  className='cell-print text-vertical w-0'>
                  Program
               </th>
               <th
                  rowSpan={3}
                  className='cell-print text-vertical w-0'>
                  Kegiatan
               </th>
               <th
                  rowSpan={3}
                  className='cell-print text-vertical w-0'>
                  Sub Kegiatan
               </th>
               <th
                  rowSpan={3}
                  className='cell-print w-0'>
                  Uraian
               </th>
               <th
                  rowSpan={3}
                  className='cell-print w-0'>
                  Sumber Dana
               </th>
               <th
                  rowSpan={3}
                  className='cell-print w-0'>
                  Lokasi
               </th>
               <th
                  colSpan={7}
                  className='cell-print w-0'>
                  Jumlah
               </th>
            </tr>

            <tr>
               <th
                  rowSpan={2}
                  className='cell-print w-0'>
                  T-1
               </th>
               <th
                  colSpan={5}
                  className='cell-print w-0'>
                  Tahun
               </th>
               <th
                  rowSpan={2}
                  className='cell-print w-0'>
                  T+1
               </th>
            </tr>
            <tr>
               <th className='cell-print w-0'>Belanja Operasi</th>
               <th className='cell-print w-0'>Belanja Modal</th>
               <th className='cell-print w-0'>Belanja Tak Terduga</th>
               <th className='cell-print w-0'>Belanja Transfer</th>
               <th className='cell-print w-0'>Jumlah (Rp)</th>
            </tr>
         </thead>
         <tbody>
            {data.map((item) => {
               const isRinci = !!item.lokasi || !!item?.sumber_dana
               const isSkpd = item?.kode_akun?.length === 22
               const kode = item?.kode_akun?.split('.')
               return (
                  <tr
                     className={`break-inside-avoid ${!isRinci && 'font-bold'} ${isSkpd && 'bg-content1 print:bg-slate-200'}`}>
                     {isSkpd ? (
                        <td
                           colSpan={5}
                           className='cell-print w-0'>
                           {item?.kode_akun}
                        </td>
                     ) : (
                        <>
                           <td className='cell-print w-0'>{kode[0]}</td>
                           <td className='cell-print w-0'>{kode[1]}</td>
                           <td className='cell-print w-0'>{kode[2]}</td>
                           <td className='cell-print w-0'>
                              {kode[4] ? [kode[3], kode[4]].join('.') : null}
                           </td>
                           <td className='cell-print w-0'>{kode[5]}</td>
                        </>
                     )}
                     <td
                        colSpan={isRinci ? 1 : 3}
                        className='cell-print p-2'>
                        {item.uraian}
                     </td>
                     {isRinci && (
                        <>
                           <td className='cell-print p-2'>{item.sumber_dana}</td>
                           <td className='cell-print p-2'>{item.lokasi}</td>
                        </>
                     )}
                     <td className='cell-print p-2 text-right'>{item.t1}</td>
                     <td className='cell-print p-2 text-right'>{item.bel_operasi}</td>
                     <td className='cell-print p-2 text-right'>{item.bel_modal}</td>
                     <td className='cell-print p-2 text-right'>{item.bel_btt}</td>
                     <td className='cell-print p-2 text-right'>{item.bel_transfer}</td>
                     <td className='cell-print  p-2 text-right'>
                        {item.jumlah?.toLocaleString('id-ID', {
                           maximumFractionDigits: 0,
                           style: 'currency',
                           currency: 'IDR',
                        })}
                     </td>
                     <td className='cell-print  p-2 text-right'>{item.t2}</td>
                  </tr>
               )
            })}
         </tbody>
      </table>
   )
}

function TableRincianPergeseran({ data }: { data: DpaBelanja['index_pergeseran'] }) {
   return (
      <table className='min-w-full leading-snug'>
         <thead className='bg-content1 break-inside-avoid text-center font-bold print:bg-slate-100'>
            <tr>
               <th
                  rowSpan={4}
                  className='cell-print text-vertical w-0'>
                  Urusan
               </th>
               <th
                  rowSpan={4}
                  className='cell-print text-vertical w-0'>
                  Bidang Urusan
               </th>
               <th
                  rowSpan={4}
                  className='cell-print text-vertical w-0'>
                  Program
               </th>
               <th
                  rowSpan={4}
                  className='cell-print text-vertical w-0'>
                  Kegiatan
               </th>
               <th
                  rowSpan={4}
                  className='cell-print text-vertical w-0'>
                  Sub Kegiatan
               </th>
               <th
                  rowSpan={4}
                  className='cell-print  w-0'>
                  Uraian
               </th>
               <th
                  rowSpan={4}
                  className='cell-print  w-0'>
                  Sumber Dana
               </th>
               <th
                  rowSpan={4}
                  className='cell-print  w-0'>
                  Lokasi
               </th>
               <th
                  colSpan={13}
                  className='cell-print w-0'>
                  Jumlah
               </th>
            </tr>
            <tr>
               <th
                  rowSpan={3}
                  className='cell-print '>
                  T-1
               </th>
               <th
                  colSpan={11}
                  className='cell-print '>
                  Tahun
               </th>
               <th
                  rowSpan={3}
                  className='cell-print '>
                  T+1
               </th>
            </tr>
            <tr>
               <th
                  colSpan={5}
                  className='cell-print '>
                  Sebelum
               </th>
               <th
                  colSpan={5}
                  className='cell-print '>
                  Setelah
               </th>
               <th
                  rowSpan={2}
                  className='cell-print '>
                  Bertambah (Berkurang)
               </th>
            </tr>
            <tr>
               <th className='cell-print'>Belanja Operasi</th>
               <th className='cell-print'>Belanja Modal</th>
               <th className='cell-print'>Belanja Tak Terduga</th>
               <th className='cell-print'>Belanja Transfer</th>
               <th className='cell-print'>Belanja Jumlah</th>
               <th className='cell-print'>Belanja Operasi</th>
               <th className='cell-print'>Belanja Modal</th>
               <th className='cell-print'>Belanja Tak Terduga</th>
               <th className='cell-print'>Belanja Transfer</th>
               <th className='cell-print'>Belanja Jumlah</th>
            </tr>
         </thead>
         <tbody>
            {data?.map((item, i) => {
               const selisih = item.bertambah_berkurang || 0
               const isRinci = !!item?.lokasi
               const strSelisih = Math.abs(selisih)?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
               })
               const kode = item?.kode_rekening?.split('.')
               const isSkpd = item?.kode_rekening?.length === 22
               return (
                  <tr
                     key={item?.kode_rekening + i}
                     className={`break-inside-avoid ${!isRinci && 'font-bold'} ${isSkpd && 'bg-content2 print:bg-slate-200'}`}>
                     {isSkpd ? (
                        <>
                           <td
                              colSpan={5}
                              className='cell-print w-0'>
                              {item.kode_rekening}
                           </td>
                        </>
                     ) : (
                        <>
                           <td className='cell-print w-0'>{kode[0]}</td>
                           <td className='cell-print w-0'>{kode[1]}</td>
                           <td className='cell-print w-0'>{kode[2]}</td>
                           <td className='cell-print w-0'>
                              {kode[4] ? [kode[3], kode[4]].join('.') : null}
                           </td>
                           <td className='cell-print w-0'>{kode[5]}</td>
                        </>
                     )}
                     <td
                        colSpan={isRinci ? 1 : 3}
                        className='cell-print'>
                        {item?.uraian}
                     </td>
                     {isRinci && (
                        <>
                           <td className='cell-print'>{item?.sumber_dana}</td>
                           <td className='cell-print'>{item?.lokasi}</td>
                        </>
                     )}
                     <td className='cell-print'>{item?.t1}</td>
                     <td className='cell-print'>
                        {item?.sebelum_bel_operasi?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print'>
                        {item?.sebelum_bel_modal?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print'>
                        {item?.sebelum_bel_btt?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print'>
                        {item?.sebelum_bel_transfer?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print'>
                        {item?.sebelum_jumlah?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print'>
                        {item?.setelah_bel_operasi?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print'>
                        {item?.setelah_bel_modal?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print'>
                        {item?.setelah_bel_btt?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print'>
                        {item?.setelah_bel_transfer?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print'>
                        {item?.setelah_jumlah?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print w-0 text-right'>
                        {selisih >= 0 ? strSelisih : `(${strSelisih})`}
                     </td>
                     <td className='cell-print w-0 text-right'>{item?.t2}</td>
                  </tr>
               )
            })}
         </tbody>
      </table>
   )
}

export default function DpaRkaBelanja({
   id_daerah = 0,
   id_skpd = 0,
   tahun = 0,
   token = '',
   dataSkpd: { sub_skpd, tapd: _tapd },
}: Props) {
   const [tapd, setTapd] = useState<Tapd[] | undefined>(_tapd ?? undefined)
   const [skpd, setSkpd] = useState<any>(id_skpd?.toString() ?? '')
   const [jadwal, setJadwal] = useState<any>('')
   const [taggal, setTaggal] = useState('')
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

   const { data: dpaSkpd, isFetching } = useSipdPetaFetcher<DpaBelanja>({
      token,
      url: `https://service.sipd.kemendagri.go.id/referensi/strict/laporan/dpa/dpa/belanja/${skpd}/${jadwal}`,
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
      const lokasi = dpaSkpd?.nama_ibu_kota
      const date = dpaSkpd?.tanggal || new Date()
      const tanggal = new Date(date).toLocaleDateString('id', {
         dateStyle: 'long',
      })

      const value = `${lokasi}, ${tanggal}`
      setTaggal(value)
   }, [dpaSkpd])

   const { jabatanKepala, pangkatKepala } = useMemo(() => {
      return {
         jabatanKepala: sub_skpd?.nama_jabatan_kepala || 'KEPALA SKPD',
         pangkatKepala: sub_skpd?.pangkat_kepala || undefined,
      }
   }, [sub_skpd?.pangkat_kepala, sub_skpd?.nama_jabatan_kepala])

   const documentTitle = useMemo(() => {
      let text = 'RKA_05_BELANJA'
      if (!!dpaSkpd && dokumen) {
         text =
            (
               dokumen.kode +
               '_' +
               dpaSkpd?.kode_skpd?.substring(0, 6) +
               '_' +
               dpaSkpd?.nama_skpd?.substring(0, 120)
            )?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') + '_05_BELANJA'
      }
      return text
   }, [dpaSkpd, dokumen])

   const printRef = useRef(null)
   const handlePrint = useReactToPrint({
      content: () => printRef.current,
      documentTitle,
   })
   const handleExport = useCallback(() => {
      if (!dokumen || !dpaSkpd) return
      const { index_pergeseran, index, rak, ...skpdSettings } = dpaSkpd
      const isPerubahan = !!dpaSkpd?.index_pergeseran?.length && !dpaSkpd?.index?.length
      if (isPerubahan) {
         dowloadRkaBelanja({
            dokumen,
            items: index_pergeseran,
            rak,
            skpdSettings,
            tahun,
            jabatanKepala,
            pangkatKepala,
            tapd,
         })
      } else {
         toast.warning('Export excel dpa murni masih dalam pengembangan')
      }
   }, [dokumen, dpaSkpd, tahun, tapd, jabatanKepala, pangkatKepala])
   return (
      <>
         {(isFetching || loadingSkpd || loadingJadwal) && (
            <Loading className='absolute inset-0 z-50 size-full' />
         )}
         <div className='content sticky left-0 flex flex-col gap-4 pt-4'>
            <Autocomplete
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
               <div className='top-navbar content sticky left-1/2 z-10 flex w-fit  -translate-x-1/2 gap-4 rounded-b-3xl py-4 backdrop-blur'>
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
                     color='primary'
                     onPress={handleExport}
                     isDisabled={isFetching}>
                     Export Excel
                  </Button>
               </div>
               <div className='content size-fit min-w-full max-w-max pb-10 '>
                  <div
                     ref={printRef}
                     className='w-fit min-w-full max-w-max text-base print:bg-white print:text-black'>
                     <TableKop
                        dokumen={dokumen}
                        tahun={tahun}
                        kodeSkpd={dpaSkpd?.kode_skpd}
                        nomorDpa={dpaSkpd?.nomor_dpa}
                        namaSkpd={dpaSkpd?.nama_skpd}
                     />
                     <div className='h-2' />
                     {dpaSkpd?.tipe_q === 'NEW' ? (
                        <TableRincianPergeseran data={dpaSkpd?.index_pergeseran} />
                     ) : (
                        <TableRincian data={dpaSkpd?.index} />
                     )}
                     <div className='h-2' />
                     {!!dpaSkpd?.rak.length && (
                        <TableRak
                           rak={dpaSkpd?.rak}
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
                        className='text-lg'
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

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
import { Download, Printer, Settings } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'
import { useSipdPetaFetcher } from '@shared/hooks/use-sipd-peta-fetcher'

import dowloadExcelRincianBelanja from './export-excel-rincian-perubahan'

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

interface ListSubKegiatanSkpdSipdPetaResponse {
   id_skpd: number
   nama_skpd: string
   kode_skpd: string
   items: SubKegiatan[]
}

interface SubKegiatan {
   id_daerah: number
   tahun: number
   id_unit: number
   id_skpd: number
   kode_skpd: string
   nama_skpd: string
   id_sub_skpd: number
   kode_sub_skpd: string
   nama_sub_skpd: string
   id_urusan: number
   id_bidang_urusan: number
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   id_program: number
   kode_program: string
   nama_program: string
   id_giat: number
   kode_giat: string
   nama_giat: string
   id_sub_giat: number
   kode_sub_giat: string
   nama_sub_giat: string
   nilai: number
   nilai_rak: number
   status: number
   rak_belum_sesuai: number
}

export interface DpaRinciSubGiat {
   id_jadwal_sipd: number
   id_tahap: number
   nomor_dpa: string
   tanggal_dpa: string
   nama_pa: string
   nip_pa: string
   tanun: number
   nama_daerah: string
   nama_ibukota: string
   kode_urusan: string
   nama_urusan: string
   kode_bidang_urusan: string
   nama_bidang_urusan: string
   kode_skpd: string
   nama_skpd: string
   kode_sub_skpd: string
   nama_sub_skpd: string
   kode_program: string
   nama_program: string
   kode_giat: string
   nama_giat: string
   kode_sub_giat: string
   nama_sub_giat: string
   nama_dana: string
   nama_kab_kota: string
   nama_kecamatan: string
   nama_kelurahan: string
   waktu_mulai: string
   waktu_akhir: string
   sasaran: string
   pagu: number
   pagu_n_lalu: number
   pagu_n_depan: number
   pagu_indikatif: number
   tolok_ukur_capaian: string
   target_kinerja_capaian: string
   tolok_ukuran_keluaran: string
   target_kinerja_keluaran: string
   tolok_ukur_hasil: string
   target_kinerja_hasi: string
   total: number
   nama_ppkd: string
   nip_ppkd: string
   item: Rincian[]
   rak: Rak
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

export interface Rincian {
   kode_akun: string
   uraian: string
   koefisien: string
   satuan: string
   harga_satuan: number
   pajak: number
   nilai: number
   sebelum_koefisien: string
   sebelum_satuan: string
   sebelum_harga_satuan: number
   sebelum_pajak: number
   sebelum_nilai: number
   setelah_koefisien: string
   setelah_satuan: string
   setelah_harga_satuan: number
   setelah_pajak: number
   setelah_nilai: number
   bertambah_berkurang: number
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
      header: 'Ringkasan Rencana Kerja dan Anggaran Satuan Kerja Perangkat Daerah',
   },
   rkpa: {
      name: 'RKPA',
      title: 'Rencana Kerja dan Perubahan Anggaran',
      kode: 'RKPA',
      header: 'Ringkasan Rencana Kerja dan Perubahan Anggaran Satuan Kerja Perangkat Daerah',
   },
}

interface PropsTableRak {
   rincianRak: DpaRinciSubGiat['rak']
   tanggal: string
   ibuKota: string
   jabatanKepala?: string | null
   pangkatKepala?: string
   namaSkpd: string
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
      jabatanKepala,
      pangkatKepala,
      namaKepalaSkpd,
      namaPpkd,
      namaSkpd,
      nipKepalaSkpd,
      nipPpkd,
      kodeDok,
      ibuKota,
   } = props
   const jumlah = Object.keys(rincianRak)?.reduce((acc, key) => {
      const val =
         typeof rincianRak[key as keyof Rak] === 'number' && key !== 'uraian' && key !== 'jumlah'
            ? rincianRak[key as keyof Rak]
            : 0
      acc += val as number
      return acc
   }, 0)
   const rak = { ...rincianRak, jumlah }
   const tanggalStr = (tanggal ? new Date(tanggal) : new Date()).toLocaleString('id', {
      dateStyle: 'long',
   })

   return (
      <div className='flex h-fit max-h-max'>
         <table className='min-w-[50%] leading-snug'>
            <tbody>
               <tr className='break-inside-avoid'>
                  <td
                     colSpan={2}
                     className='cell-print bg-content1 p-2 text-center font-bold print:bg-slate-100'>
                     Rencana Realisasi Pendapatan per Bulan*) (Rp)
                  </td>
               </tr>
               {Object.keys(rak)?.map((i) => {
                  const key = i as keyof Rak
                  const value = rak[key]
                  return key === 'uraian' ? null : (
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
         <div className='flex w-1/2 flex-col gap-4 pt-px'>
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
   const { dokumen, tahun } = props
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
                  <div className='whitespace-nowrap'>{dokumen?.kode} - RINCIAN BELANJA</div>
                  <div>SKPD</div>
               </td>
            </tr>
            <tr className='text-center uppercase'>
               <td
                  colSpan={3}
                  className='cell-print'>
                  PEMERINTAH KABUPATEN LEMBATA TAHUN ANGGARAN {tahun}
               </td>
            </tr>
         </tbody>
      </table>
   )
}

function TableRincian({
   rincian,
   idSubSkpd,
}: {
   rincian: DpaRinciSubGiat['item']
   idSubSkpd: number
}) {
   const [jumlah] = rincian
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
                  className='cell-print'>
                  Uraian
               </th>
               <th
                  colSpan={4}
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
               <th className='cell-print w-0'>Volume / Koefisien</th>
               <th className='cell-print w-0'>Satuan</th>
               <th className='cell-print w-0'>Harga</th>
               <th className='cell-print w-0'>PPn</th>
            </tr>
         </thead>
         <tbody>
            {rincian.map((item, i) => {
               const isRinci = !item.kode_akun && !item.uraian?.startsWith('[')
               return (
                  <tr
                     key={idSubSkpd + item.kode_akun + i}
                     className={`break-inside-avoid ${!isRinci && 'font-bold'}`}>
                     <td className='cell-print w-0'>{item.kode_akun}</td>
                     <td
                        colSpan={isRinci ? 1 : 5}
                        className='cell-print p-2'>
                        {item.uraian?.split('/n')?.map((item, i) => <div key={i}>{item}</div>)}
                     </td>
                     {isRinci && (
                        <>
                           <td className='cell-print p-2'>{item.koefisien}</td>
                           <td className='cell-print p-2'>{item.satuan}</td>
                           <td className='cell-print p-2 text-right'>
                              {item.harga_satuan?.toLocaleString('id')}
                           </td>
                           <td className='cell-print p-2 text-center'>{item.pajak}%</td>
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
                  colSpan={6}
                  className='cell-print'>
                  Jumlah Anggaran Sub Kegiatan
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

function TableRincianPergeseran({
   rincian,
   idSubSkpd,
}: {
   rincian: DpaRinciSubGiat['item']
   idSubSkpd: number
}) {
   const [jumlah] = rincian
   const strSelisih = Math.abs(jumlah.bertambah_berkurang || 0).toLocaleString('id-ID', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'IDR',
   })
   return (
      <table className='min-w-full leading-snug'>
         <thead className='bg-content1 break-inside-avoid text-center font-bold leading-none print:bg-slate-100'>
            <tr>
               <th
                  rowSpan={3}
                  className='cell-print w-0'>
                  Kode Rekening
               </th>
               <th
                  rowSpan={3}
                  className='cell-print'>
                  Uraian
               </th>
               <th
                  colSpan={10}
                  className='cell-print w-0'>
                  Rincian Perhitungan
               </th>
               <th
                  rowSpan={3}
                  className='cell-print w-0'>
                  Bertambah (Berkurang) (Rp)
               </th>
            </tr>
            <tr>
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
            </tr>
            <tr>
               <th className='cell-print w-0'>Koefisien / Volume</th>
               <th className='cell-print w-0'>Satuan</th>
               <th className='cell-print w-0'>Harga</th>
               <th className='cell-print w-0'>PPN</th>
               <th className='cell-print w-0'>Jumlah</th>
               <th className='cell-print w-0'>Koefisien / Volume</th>
               <th className='cell-print w-0'>Satuan</th>
               <th className='cell-print w-0'>Harga</th>
               <th className='cell-print w-0'>PPN</th>
               <th className='cell-print w-0'>Jumlah</th>
            </tr>
         </thead>
         <tbody>
            {rincian?.map((item, i) => {
               const isRinci = !item.kode_akun && !item.uraian?.startsWith('[')
               const strSelisih = Math.abs(item?.bertambah_berkurang)?.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
               })
               return (
                  <tr
                     key={idSubSkpd + item?.kode_akun + i}
                     className={`break-inside-avoid ${!!isRinci ? '' : 'font-bold'}`}>
                     <td className='cell-print w-0'>{item.kode_akun}</td>
                     <td
                        colSpan={isRinci ? 1 : 5}
                        className='cell-print'>
                        {item?.uraian?.split('/n')?.map((part, i) => <div key={i}>{part}</div>)}
                     </td>
                     {isRinci && (
                        <>
                           <td className='cell-print'>{item?.sebelum_koefisien}</td>
                           <td className='cell-print'>{item?.sebelum_satuan}</td>
                           <td className='cell-print text-right'>
                              {item?.sebelum_harga_satuan?.toLocaleString('id')}
                           </td>
                           <td className='cell-print text-center'>{item?.sebelum_pajak}%</td>
                        </>
                     )}
                     <td className='cell-print text-right'>
                        {item?.sebelum_nilai?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     {isRinci ? (
                        <>
                           <td className='cell-print'>{item?.setelah_koefisien}</td>
                           <td className='cell-print'>{item?.setelah_satuan}</td>
                           <td className='cell-print text-right'>
                              {item?.setelah_harga_satuan?.toLocaleString('id')}
                           </td>
                           <td className='cell-print text-center'>{item?.setelah_pajak}%</td>
                        </>
                     ) : (
                        <td
                           colSpan={4}
                           className='cell-print'
                        />
                     )}
                     <td className='cell-print text-right'>
                        {item?.setelah_nilai?.toLocaleString('id-ID', {
                           style: 'currency',
                           currency: 'IDR',
                           maximumFractionDigits: 0,
                        })}
                     </td>
                     <td className='cell-print w-0 text-right'>
                        {item?.bertambah_berkurang >= 0 ? strSelisih : `(${strSelisih})`}
                     </td>
                  </tr>
               )
            })}
            <tr className='bg-content1 break-inside-avoid text-right font-bold print:bg-slate-100'>
               <td
                  colSpan={6}
                  className='cell-print'>
                  Jumlah Anggaran Sub Kegiatan
               </td>
               <td className='cell-print'>
                  {jumlah?.sebelum_nilai?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td
                  colSpan={4}
                  className='cell-print '>
                  Jumlah Anggaran Sub Kegiatan
               </td>
               <td className='cell-print'>
                  {jumlah?.setelah_nilai?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
               <td className='cell-print'>
                  {jumlah?.bertambah_berkurang >= 0 ? strSelisih : `(${strSelisih})`}
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

export default function DpaRincianBelanja({
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
   const [selectedSubGiat, setSelectedSubGiat] = useState<SubKegiatan & { kode_sbl: string }>()
   const [isMurni, setIsMurni] = useState(true)

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

   const { data: dataSubGiat, isFetching: loadingSubGiat } =
      useSipdPetaFetcher<ListSubKegiatanSkpdSipdPetaResponse>({
         token,
         url: `https://service.sipd.kemendagri.go.id/referensi/strict/dpa/penarikan/belanja/skpd/${skpd}`,
         enabled: !!skpd,
      })

   const { data: dpaSkpd, isFetching } = useSipdPetaFetcher<DpaRinciSubGiat>({
      token,
      url: `https://service.sipd.kemendagri.go.id/referensi/strict/laporan/dpa/dpa/rincian-belanja/${skpd}`,
      enabled: !!jadwal && !!selectedSubGiat,
      params: {
         id_unit: selectedSubGiat?.id_unit,
         id_skpd: selectedSubGiat?.id_skpd,
         id_sub_skpd: selectedSubGiat?.id_sub_skpd,
         id_urusan: selectedSubGiat?.id_urusan,
         id_bidang_urusan: selectedSubGiat?.id_bidang_urusan,
         id_program: selectedSubGiat?.id_program,
         id_giat: selectedSubGiat?.id_giat,
         id_sub_giat: selectedSubGiat?.id_sub_giat,
         id_jadwal_sipd: jadwal,
      },
   })

   const listSubgiat = useMemo(() => {
      if (dataSubGiat && !!dataSubGiat?.items?.length) {
         return dataSubGiat?.items?.map((item) => {
            return {
               ...item,
               kode_sbl: [
                  item.id_sub_giat,
                  item?.id_sub_skpd,
                  item?.id_skpd,
                  item.id_bidang_urusan,
               ].join('.'),
            }
         })
      } else {
         return []
      }
   }, [dataSubGiat])

   useEffect(() => {
      if (listSkpd && listSkpd[0]?.id_skpd.toString() !== skpd) {
         setSkpd(listSkpd[0]?.id_skpd.toString())
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [listSkpd])

   const firstPartNorDpa = useMemo(() => {
      return dpaSkpd?.nomor_dpa ? dpaSkpd?.nomor_dpa?.split('/')[0] : ''
   }, [dpaSkpd?.nomor_dpa])

   useEffect(() => {
      if (dpaSkpd) {
         const isMurni = !!dpaSkpd?.item?.find((item) => !!item?.nilai)
         isMurni ? setDokumen(JENIS_DOKUMEN.dpa) : setDokumen(JENIS_DOKUMEN.dppa)
         isMurni
            ? setDisableKeysDok(['RDPPA', 'DPPA', 'RKPA'])
            : setDisableKeysDok(['RDPA', 'DPA', 'RKA'])
         setIsMurni(isMurni)
      } else {
         setDokumen(undefined)
         setDisableKeysDok([])
      }
   }, [dpaSkpd])

   const documentTitle = useMemo(() => {
      let text = 'RKA_06_RINCIAN_BELANJA'
      if (!!dpaSkpd && typeof window !== 'undefined' && dokumen) {
         text =
            (dokumen?.kode + '_' + dpaSkpd?.kode_sub_giat + '_' + dpaSkpd?.nama_sub_giat)
               ?.substring(0, 120)
               ?.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') +
            '_' +
            selectedSubGiat?.id_sub_skpd
      }
      return text
   }, [dpaSkpd, dokumen, selectedSubGiat?.id_sub_skpd])

   const { jabatanKepala, pangkatKepala } = useMemo(() => {
      return {
         jabatanKepala: sub_skpd?.nama_jabatan_kepala || 'KEPALA SKPD',
         pangkatKepala: sub_skpd?.pangkat_kepala || undefined,
      }
   }, [sub_skpd?.pangkat_kepala, sub_skpd?.nama_jabatan_kepala])

   const printRef = useRef(null)
   const handlePrint = useReactToPrint({
      content: () => printRef.current,
      documentTitle,
   })
   const handleEsxprtExcel = useCallback(() => {
      if (!!dpaSkpd?.item?.length && !!dokumen) {
         const isPerubahan =
            !!dpaSkpd?.item.find((d) => d.sebelum_satuan) ||
            !!dpaSkpd?.item.find((d) => d.setelah_satuan)

         if (isPerubahan) {
            dowloadExcelRincianBelanja({
               data: dpaSkpd,
               dokumen,
               jabatanKepala,
               pangkatKepala,
               tapd,
            })
         } else {
            toast.warning('Export Excel untuk dpa murni belum berfungsi')
         }
      }
   }, [dokumen, jabatanKepala, pangkatKepala, tapd, dpaSkpd])

   const handleSubgiatSelected = useCallback(
      (key: any) => {
         if (typeof key === 'string' && listSubgiat?.length) {
            const subGiat = listSubgiat?.find((s) => s.kode_sbl === key)
            setSelectedSubGiat(subGiat)
         }
      },
      [listSubgiat]
   )
   const capaian = dpaSkpd?.tolok_ukur_capaian?.split('\n') || []
   const target_apaian = dpaSkpd?.target_kinerja_capaian?.split('\n') || []
   return (
      <>
         {(isFetching || loadingSkpd || loadingJadwal) && (
            <Loading className='absolute inset-0 z-50 size-full' />
         )}
         <div className='content sticky left-0 space-y-3 pt-4'>
            <Autocomplete
               isInvalid={!skpd}
               variant='bordered'
               isLoading={loadingSkpd}
               label='Pilih SKPD'
               selectedKey={skpd}
               onSelectionChange={setSkpd}
               defaultItems={listSkpd || []}>
               {(item) => (
                  <AutocompleteItem
                     startContent={item.kode_skpd}
                     key={item.id_skpd}>
                     {item?.nama_skpd}
                  </AutocompleteItem>
               )}
            </Autocomplete>
            <Autocomplete
               isLoading={loadingJadwal}
               label='Pilih Jadwal'
               isInvalid={!jadwal}
               selectedKey={jadwal}
               variant='bordered'
               onSelectionChange={setJadwal}
               defaultItems={listJadwal || []}>
               {(item) => (
                  <AutocompleteItem
                     key={item.id_jadwal_sipd}
                     value={item?.jadwal_sipd_penatausahaan}>
                     {item?.jadwal_sipd_penatausahaan}
                  </AutocompleteItem>
               )}
            </Autocomplete>
            <Autocomplete
               isInvalid={!selectedSubGiat}
               isLoading={loadingSubGiat}
               label='Pilih Sub Kegiatan'
               selectedKey={selectedSubGiat ? selectedSubGiat?.kode_sbl : '' || ''}
               variant='bordered'
               onSelectionChange={handleSubgiatSelected}
               defaultItems={listSubgiat || []}>
               {(item) => (
                  <AutocompleteItem
                     key={item.kode_sbl}
                     value={item?.nama_sub_giat}
                     textValue={item?.nama_sub_giat}>
                     <div>
                        <div>{item?.nama_sub_skpd}</div>
                        <div>{item?.nama_program}</div>
                        <div>Kegiatan: {item?.nama_giat}</div>
                        <div className='font-bold'>
                           {item?.nama_sub_giat} {}
                           {item?.nilai?.toLocaleString('id', {
                              style: 'currency',
                              currency: 'IDR',
                           })}
                        </div>
                     </div>
                  </AutocompleteItem>
               )}
            </Autocomplete>
         </div>
         {!!dpaSkpd && !!dokumen && !!selectedSubGiat && (
            <>
               <div className='top-navbar content sticky left-1/2 flex w-fit -translate-x-1/2 gap-4 rounded-b-2xl py-4 text-base backdrop-blur-sm'>
                  <Dropdown>
                     <DropdownTrigger>
                        <Button
                           variant='bordered'
                           color='secondary'
                           isDisabled={!!!dpaSkpd || isFetching}
                           className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
                           startContent={<Settings className='size-5' />}>
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
                     color='primary'
                     className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
                     onPress={handlePrint}
                     isDisabled={isFetching}
                     endContent={<Printer className='size-5' />}>
                     <span className='hidden sm:inline-flex'>Cetak</span>
                  </Button>
                  <Button
                     color='primary'
                     className='sm:rounded-medium min-w-10 rounded-full px-2 capitalize backdrop-blur-sm sm:min-w-20'
                     onPress={handleEsxprtExcel}
                     endContent={<Download className='size-5' />}
                     isDisabled={isFetching}>
                     <span className='hidden sm:inline-flex'>Export Excel</span>
                  </Button>
               </div>
               <div className='content pb-10'>
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
                     <table className='min-w-full  leading-5'>
                        <tbody>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Nomor</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.nomor_dpa?.replace(firstPartNorDpa, dokumen?.kode)}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Urusan Pemerintahan</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.kode_urusan} {dpaSkpd?.nama_urusan}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Bidang Urusan</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.kode_bidang_urusan} {dpaSkpd?.nama_bidang_urusan}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Program</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.kode_program} {dpaSkpd?.nama_program}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Kegiatan</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.kode_giat} {dpaSkpd?.nama_giat}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Organisasi</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.kode_skpd} {dpaSkpd?.nama_skpd}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Unit</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.kode_sub_skpd} {dpaSkpd?.nama_sub_skpd}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Alokasi Tahun -1</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.pagu_n_lalu?.toLocaleString('id', {
                                    style: 'currency',
                                    currency: 'IDR',
                                 })}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Alokasi Tahun</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.pagu?.toLocaleString('id', {
                                    style: 'currency',
                                    currency: 'IDR',
                                 })}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-2'>Alokasi Tahun + 1</td>
                              <td>:</td>
                              <td className='pr-2'>
                                 {dpaSkpd?.pagu_n_depan?.toLocaleString('id', {
                                    style: 'currency',
                                    currency: 'IDR',
                                 })}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                     <div className='h-2' />
                     <table className='min-w-full leading-5'>
                        <thead className='break-inside-avoid'>
                           <tr className='text-center font-bold'>
                              <th
                                 rowSpan={isMurni ? 1 : 2}
                                 className='cell-print'>
                                 Indikator
                              </th>
                              {isMurni ? (
                                 <>
                                    <th className='cell-print'>Tolak Ukur Kerja</th>
                                    <th className='cell-print'>Target Kinerja</th>
                                 </>
                              ) : (
                                 <>
                                    <th
                                       colSpan={2}
                                       className='cell-print'>
                                       Sebelum
                                    </th>
                                    <th
                                       colSpan={2}
                                       className='cell-print'>
                                       Setelah
                                    </th>
                                 </>
                              )}
                           </tr>
                           {!isMurni && (
                              <tr className='text-center font-bold '>
                                 <th className='cell-print'>Tolak Ukur Kerja</th>
                                 <th className='cell-print'>Target Kinerja</th>
                                 <th className='cell-print'>Tolak Ukur Kerja</th>
                                 <th className='cell-print'>Target Kinerja</th>
                              </tr>
                           )}
                        </thead>
                        <tbody>
                           <tr className='break-inside-avoid'>
                              <td
                                 rowSpan={capaian?.length}
                                 className='cell-print'>
                                 Capaian Program
                              </td>
                              {!isMurni && (
                                 <>
                                    <td className='cell-print'>{capaian[0]}</td>
                                    <td className='cell-print'>
                                       {target_apaian
                                          ? target_apaian[0]
                                               ?.split(',')
                                               ?.map((e) => e?.trim())
                                               .join(', ') ?? '-'
                                          : '-'}
                                    </td>
                                 </>
                              )}
                              <td className='cell-print'>{capaian[0]}</td>
                              <td className='cell-print'>
                                 {target_apaian
                                    ? target_apaian[0]
                                         ?.split(',')
                                         ?.map((e) => e?.trim())
                                         .join(', ') ?? '-'
                                    : '-'}
                              </td>
                           </tr>
                           {capaian?.map((item, i) =>
                              i > 0 ? (
                                 <tr key={i}>
                                    {!isMurni && (
                                       <>
                                          <td className='cell-print'>{item}</td>
                                          <td className='cell-print'>
                                             {target_apaian
                                                ? target_apaian[i]
                                                     ?.split(',')
                                                     ?.map((e) => e?.trim())
                                                     .join(', ') ?? '-'
                                                : '-'}
                                          </td>
                                       </>
                                    )}
                                    <td className='cell-print'>{item}</td>
                                    <td className='cell-print'>
                                       {target_apaian
                                          ? target_apaian[i]
                                               ?.split(',')
                                               ?.map((e) => e?.trim())
                                               .join(', ') ?? '-'
                                          : '-'}
                                    </td>
                                 </tr>
                              ) : null
                           )}
                           <tr className='break-inside-avoid'>
                              <td className='cell-print'>Masukan</td>
                              {!isMurni && (
                                 <>
                                    <td className='cell-print'>Dana Yang Dibutuhkan</td>
                                    <td className='cell-print'>
                                       {dpaSkpd?.item[0]?.sebelum_nilai?.toLocaleString('id', {
                                          style: 'currency',
                                          currency: 'IDR',
                                       })}
                                    </td>
                                 </>
                              )}
                              <td className='cell-print'>Dana Yang Dibutuhkan</td>
                              <td className='cell-print'>
                                 {dpaSkpd?.total?.toLocaleString('id', {
                                    style: 'currency',
                                    currency: 'IDR',
                                 })}
                              </td>
                           </tr>
                           <tr className='break-inside-avoid'>
                              <td className='cell-print'>Keluaran</td>
                              {!isMurni && (
                                 <>
                                    <td className='cell-print'>{dpaSkpd?.tolok_ukuran_keluaran}</td>
                                    <td className='cell-print'>
                                       {dpaSkpd?.target_kinerja_keluaran}
                                    </td>
                                 </>
                              )}
                              <td className='cell-print'>{dpaSkpd?.tolok_ukuran_keluaran}</td>
                              <td className='cell-print'>{dpaSkpd?.target_kinerja_keluaran}</td>
                           </tr>
                           <tr className='break-inside-avoid'>
                              <td className='cell-print'>Hasil</td>
                              {!isMurni && (
                                 <>
                                    <td className='cell-print'>{dpaSkpd?.tolok_ukur_hasil}</td>
                                    <td className='cell-print'>{dpaSkpd?.target_kinerja_hasi}</td>
                                 </>
                              )}
                              <td className='cell-print'>{dpaSkpd?.tolok_ukur_hasil}</td>
                              <td className='cell-print'>{dpaSkpd?.target_kinerja_hasi}</td>
                           </tr>
                        </tbody>
                     </table>
                     <div className='h-2' />
                     <table className='min-w-full leading-5'>
                        <tbody>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-3'>Sub Kegiatan</td>
                              <td>:</td>
                              <td className='r-3'>
                                 {dpaSkpd?.kode_sub_giat} {dpaSkpd?.nama_sub_giat}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-3'>Sumber Pendanaan</td>
                              <td>:</td>
                              <td className='pr-3'>
                                 {dpaSkpd?.nama_dana
                                    ?.split('\n')
                                    ?.map((item, index) => <p key={index}>{item}</p>)}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-3'>Lokasi</td>
                              <td>:</td>
                              <td className='r-3'>
                                 {dpaSkpd?.nama_kab_kota} {dpaSkpd?.nama_kecamatan}{' '}
                                 {dpaSkpd?.nama_kelurahan}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-3'>Waktu</td>
                              <td>:</td>
                              <td className='r-3'>
                                 Mulai {dpaSkpd?.waktu_mulai} sampai {dpaSkpd?.waktu_akhir}
                              </td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-3'>Sasaran</td>
                              <td>:</td>
                              <td className='r-3'>{dpaSkpd?.sasaran}</td>
                           </tr>
                           <tr className='border-print break-inside-avoid'>
                              <td className='pl-3'>Keterangan</td>
                              <td>:</td>
                              <td className='r-3'>-</td>
                           </tr>
                        </tbody>
                     </table>
                     <div className='h-2' />
                     {isMurni ? (
                        <TableRincian
                           idSubSkpd={selectedSubGiat?.id_sub_skpd}
                           rincian={dpaSkpd?.item}
                        />
                     ) : (
                        <TableRincianPergeseran
                           idSubSkpd={selectedSubGiat?.id_sub_skpd}
                           rincian={dpaSkpd?.item}
                        />
                     )}
                     <div className='h-2' />
                     {!!dpaSkpd?.rak && (
                        <TableRak
                           rincianRak={dpaSkpd?.rak}
                           tanggal={dpaSkpd.tanggal_dpa}
                           ibuKota={dpaSkpd?.nama_ibukota}
                           jabatanKepala={jabatanKepala}
                           pangkatKepala={pangkatKepala}
                           namaKepalaSkpd={dpaSkpd?.nama_pa}
                           nipKepalaSkpd={dpaSkpd?.nip_pa}
                           namaPpkd={dpaSkpd?.nama_ppkd}
                           nipPpkd={dpaSkpd?.nip_ppkd}
                           namaSkpd={dpaSkpd?.nama_skpd}
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

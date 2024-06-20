'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getBlSubGiatById } from '@actions/perencanaan/rka/bl-sub-giat'
import { TableAnggotaTapd } from '@components/master/tapd'
import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { AnggotaTapd } from '@zod'
import { groupBy, sumBy } from 'lodash-es'
import { ArrowLeftCircle, Eye, EyeOff, PlusCircle, Printer } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { numberToText } from '@shared/utils'

import DetailGiat from './detail-giat'
import ListRincian from './list-rincian'
import TableCatatan from './table-catatan'
import TableGiat from './table-giat'
import TableIndikatorGiat, { TableIndikatorGiatPerubahan } from './table-indikator'
import TableKepala from './table-kepala-skpd'
import TableKop from './table-kop'
import TableSubGiat from './table-sub-giat'

export type DataType = AsyncReturnType<typeof getBlSubGiatById<true>>

const filterData = (rincian: DataType['rincian'], search: string) => {
   return rincian.filter(
      (d) =>
         d.nama_standar_harga.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.kode_akun.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.nama_akun.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.nama_dana.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.nama_dana.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.group_name_7.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.spek?.toLocaleLowerCase().includes(search.toLowerCase()) ||
         String(d.harga_satuan).includes(search) ||
         String(d.total_harga).includes(search) ||
         d.group_name_8.toLocaleLowerCase().includes(search.toLowerCase())
   )
}
type Data = ReturnType<typeof filterData>

type RincianGrouped = {
   kode: string | number
   name: string
   total: number
   isKet?: boolean
   dana?: string
   total_murni: number
   list: RincianGrouped[] | Data
}

const groupRincianByLevel = (rincians: Data, groupLevel: number): RincianGrouped[] => {
   let groupedData = groupBy(
      rincians,
      (rincian) => rincian[`group_kode_${groupLevel}` as keyof typeof rincian]
   )
   return Object.entries(groupedData).map(([groupKey, groupItems]) => {
      const firstItem = groupItems[0]
      return {
         kode: groupKey,
         dana: groupLevel === 7 ? `Sumber Dana: ${firstItem?.nama_dana}` : undefined,
         isKet: groupLevel === 8,
         name: firstItem[`group_name_${groupLevel}` as keyof typeof firstItem] as string,
         total: sumBy(groupItems, 'total_harga'),
         total_murni: sumBy(groupItems, 'total_harga_murni'),
         list: groupLevel <= 7 ? groupRincianByLevel(groupItems, groupLevel + 1) : groupItems,
      }
   })
}

const SubGiat: React.FunctionComponent<{ idSubGiat: string }> = ({ idSubGiat }) => {
   const [data, setData] = useState<RincianGrouped[]>([])
   const [filterValue, setFilterValue] = useState('')
   const [printPreview, setPrintPreview] = useState(true)
   const [dataTapd, setDataTapd] = useState<AnggotaTapd[]>()
   const [isSkpd, setIsSkpd] = useState(true)
   const router = useRouter()

   const { data: defaultData, isFetched } = useQuery({
      queryKey: [idSubGiat, 'perencanaan', 'bl_sub_giat_rinci'],
      queryFn: async ({ queryKey: [idSubGiat] }) => {
         return await getBlSubGiatById(idSubGiat, true)
      },
   })
   const subKegiatan = defaultData?.sub_kegiatan
   const isPerubahan = !!defaultData?.jadwal?.is_perubahan

   const componentRef = useRef(null)
   useEffect(() => {
      if (defaultData?.rincian?.length) {
         if (filterValue) {
            const newData = filterData(defaultData?.rincian, filterValue)
            setData(groupRincianByLevel(newData, 1))
         } else {
            setData(groupRincianByLevel(defaultData?.rincian, 1))
         }
      }
   }, [filterValue, defaultData?.rincian])

   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      onBeforeGetContent: () => {
         setFilterValue('')
      },
   })

   useEffect(() => {
      if (defaultData?.skpd?.tapd?.length) {
         setDataTapd(defaultData?.skpd?.tapd)
      }
   }, [defaultData?.skpd?.tapd])

   const back = useCallback(() => {
      router.back()
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])
   return (
      <div className='content to-content1 relative bg-gradient-to-b px-4 pb-14'>
         <div
            ref={componentRef}
            id='rka'
            className={`rounded-medium mb-10 size-fit min-w-full p-2 sm:py-4 print:p-0  ${isPerubahan ? 'text-sm print:text-xs' : 'text-sm'} print:bg-white print:text-black`}>
            <TableKop
               isPerubahan={isPerubahan}
               tahun={subKegiatan?.tahun}
               printPreview={printPreview}
            />
            <div className='h-2' />
            {subKegiatan && (
               <>
                  <TableGiat printPreview={printPreview}>
                     <DetailGiat subKegiatan={subKegiatan} />
                  </TableGiat>
                  <div className='h-2' />
                  {isPerubahan ? (
                     <TableIndikatorGiatPerubahan
                        {...{
                           printPreview,
                           capaian_bl_giat: subKegiatan.capaian_bl_giat,
                           capaian_bl_giat_murni: subKegiatan.capaian_bl_giat_murni,
                           hasil_bl_giat: subKegiatan.hasil_bl_giat,
                           hasil_bl_giat_murni: subKegiatan.hasil_bl_giat_murni,
                           output_bl_giat: subKegiatan.output_bl_giat,
                           output_bl_giat_murni: subKegiatan.output_bl_giat_murni,
                           pagu: subKegiatan.pagu,
                           pagu_murni: subKegiatan.pagu_murni,
                        }}
                     />
                  ) : (
                     <TableIndikatorGiat
                        {...{
                           printPreview,
                           capaian_bl_giat: subKegiatan.capaian_bl_giat,
                           hasil_bl_giat: subKegiatan.hasil_bl_giat,
                           output_bl_giat: subKegiatan.output_bl_giat,
                           pagu: subKegiatan.pagu,
                        }}
                     />
                  )}
                  <div className='h-2' />
                  <TableSubGiat subKegiatan={subKegiatan} />
               </>
            )}

            <div className='h-2' />
            <table className='min-w-full'>
               {isPerubahan ? <THeadRincianPerubahan /> : <THeadRincian />}
               <tbody>
                  <ListRincian
                     data={data}
                     isPerubahan={isPerubahan}
                     printPreview={printPreview}
                  />
                  <tr className='print:break-inside-avoid'>
                     <td
                        colSpan={6}
                        className='cell-print text-right font-semibold'>
                        Jumlah :
                     </td>
                     {isPerubahan ? (
                        <>
                           <td className='cell-print text-right font-semibold'>
                              {numberToText(subKegiatan?.pagu_murni)}
                           </td>
                           <td
                              colSpan={4}
                              className='cell-print text-right font-semibold'></td>
                           <td className='cell-print text-right font-semibold'>
                              {numberToText(subKegiatan?.pagu || 0)}
                           </td>
                        </>
                     ) : (
                        <td className='cell-print text-right font-semibold'>
                           {numberToText(subKegiatan?.pagu || 0)}
                        </td>
                     )}
                     {isPerubahan && (
                        <td className='cell-print text-right font-semibold'>
                           {numberToText(
                              (subKegiatan?.pagu || 0) - (subKegiatan?.pagu_murni || 0),
                              0,
                              true
                           )}
                        </td>
                     )}
                  </tr>
               </tbody>
            </table>
            <TableKepala
               printPreview={printPreview}
               nama_jabatan_kepala={defaultData?.skpd?.sub_skpd?.nama_jabatan_kepala}
               nama_kepala={defaultData?.skpd?.sub_skpd?.nama_kepala}
               nip_kepala={defaultData?.skpd?.sub_skpd?.nip_kepala}
               pangkat_kepala={defaultData?.skpd?.sub_skpd?.pangkat_kepala}
            />
            <div className='h-2' />
            <TableCatatan printPreview={printPreview} />
            <div className='h-2' />
            <TableAnggotaTapd
               values={dataTapd}
               onChange={setDataTapd}
               show={printPreview}
            />
         </div>

         <div className='fixed bottom-4 left-1/2 z-[11] mx-auto mt-4 flex w-fit max-w-full -translate-x-1/2 flex-wrap items-center justify-center gap-2 print:hidden'>
            <Button
               variant='bordered'
               color='danger'
               className='sm:rounded-medium min-w-10 rounded-full px-2 backdrop-blur-sm sm:min-w-20'
               // isIconOnly
               onPress={back}>
               <ArrowLeftCircle className='size-5' />
               <span className='hidden  sm:inline-flex'>Kembali</span>
            </Button>
            <Button
               variant='solid'
               color='primary'
               className='sm:rounded-medium min-w-10 rounded-full px-2 backdrop-blur-sm sm:min-w-20'
               startContent={<PlusCircle className='size-5' />}
               as={Link}
               prefetch={false}
               scroll={false}
               href={`add-rinci`}>
               <span className='hidden sm:inline-flex'>Tambah</span>
            </Button>
            <Button
               variant='bordered'
               color='primary'
               className='sm:rounded-medium min-w-10 rounded-full px-2 backdrop-blur-sm sm:min-w-20'
               startContent={
                  printPreview ? <EyeOff className='size-5' /> : <Eye className='size-5' />
               }
               onPress={() => setPrintPreview((old) => !old)}>
               <span className='hidden sm:inline-flex'>
                  {printPreview ? 'Sembunyikan' : 'Lihat'}
               </span>
            </Button>
            <Button
               variant='bordered'
               color='primary'
               className='sm:rounded-medium min-w-10 rounded-full px-2 backdrop-blur-sm sm:min-w-20'
               startContent={<Printer className='size-5' />}
               onPress={handlePrint}>
               <span className='hidden sm:inline-flex'>Cetak</span>
            </Button>
         </div>
      </div>
   )
}
export default SubGiat
export type { RincianGrouped }

function THeadRincian() {
   return (
      <thead>
         <tr className='print:break-inside-avoid'>
            <th
               rowSpan={2}
               className='cell-print'>
               Kode Rekening
            </th>
            <th
               rowSpan={2}
               className='cell-print'>
               Uraian
            </th>
            <th
               colSpan={4}
               className='cell-print'>
               Rincian Perhitungan
            </th>
            <th
               rowSpan={2}
               className='cell-print'>
               Jumlah
            </th>
         </tr>
         <tr className='print:break-inside-avoid'>
            <th className='cell-print'>Koefisien</th>
            <th className='cell-print'>Harga</th>
            <th className='cell-print'>Satuan</th>
            <th className='cell-print'>Pajak</th>
         </tr>
      </thead>
   )
}
function THeadRincianPerubahan() {
   return (
      <thead>
         <tr className='print:break-inside-avoid'>
            <th
               rowSpan={2}
               className='cell-print'>
               Kode Rekening
            </th>
            <th
               rowSpan={2}
               className='cell-print'>
               Uraian
            </th>
            <th
               colSpan={5}
               className='cell-print'>
               Rincian Perhitungan Sebelum Perubahan
            </th>
            <th
               colSpan={5}
               className='cell-print'>
               Rincian Perhitungan Setelah Perubahan
            </th>
            <th
               className='cell-print whitespace-pre-wrap'
               rowSpan={2}>
               <div>Bertambah</div>
               <div>(Berkurang)</div>
            </th>
         </tr>
         <tr className='print:break-inside-avoid'>
            <th className='cell-print'>Koefisien</th>
            <th className='cell-print'>Harga</th>
            <th className='cell-print'>Satuan</th>
            <th className='cell-print'>Pajak</th>
            <th className='cell-print'>Jumlah</th>
            <th className='cell-print'>Koefisien</th>
            <th className='cell-print'>Harga</th>
            <th className='cell-print'>Satuan</th>
            <th className='cell-print'>Pajak</th>
            <th className='cell-print'>Jumlah</th>
         </tr>
      </thead>
   )
}

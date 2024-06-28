'use client'

import { Fragment } from 'react'
import { cn } from '@nextui-org/react'
import { numberToText } from '@utils'

import { LaporanRinciBl } from './rinci-bl'

//
//

export type Props = {
   rincian: LaporanRinciBl['rincian']
}

function THeadRincian() {
   return (
      <thead className='font-bold'>
         <tr>
            <th
               className='cell-print w-0'
               rowSpan={3}>
               Kode Rekening
            </th>
            <th
               className='cell-print'
               rowSpan={3}>
               Uraian
            </th>
            <th
               className='cell-print'
               colSpan={10}>
               Rincian Perhitungan
            </th>
            <th
               className='cell-print w-0 whitespace-pre-wrap'
               rowSpan={3}>
               <div>Bertambah</div>
               <div>(Berkurang)</div>
            </th>
         </tr>
         <tr>
            <th
               className='cell-print w-0'
               colSpan={5}>
               Sebelum
            </th>
            <th
               className='cell-print w-0'
               colSpan={5}>
               Sesudah
            </th>
         </tr>
         <tr>
            <th className='cell-print w-0'>Koefisien</th>
            <th className='cell-print w-0'>Harga</th>
            <th className='cell-print w-0'>Satuan</th>
            <th className='cell-print w-0'>PPN</th>
            <th className='cell-print w-0'>Jumlah</th>
            <th className='cell-print w-0'>Koefisien</th>
            <th className='cell-print w-0'>Harga</th>
            <th className='cell-print w-0'>Satuan</th>
            <th className='cell-print w-0'>PPN</th>
            <th className='cell-print w-0'>Jumlah</th>
         </tr>
      </thead>
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

interface TableIndikatorGiatProps {
   capaian_bl_giat: { target_teks: string; tolak_ukur: string }[]
   capaian_bl_giat_murni: { target_teks: string; tolak_ukur: string }[]
   pagu: number
   pagu_murni?: number
   output_bl_giat: { target_teks: string; tolok_ukur: string }[]
   output_bl_giat_murni: { target_teks: string; tolok_ukur: string }[]
   output_bl_sub_giat: { target_teks: string; tolak_ukur: string }[]
   output_bl_sub_giat_murni: { target_teks: string; tolak_ukur: string }[]
   hasil_bl_giat: { target_teks: string; tolak_ukur: string }[]
   hasil_bl_giat_murni: { target_teks: string; tolak_ukur: string }[]
}

export function TableIndikatorGiatPerubahan(props: TableIndikatorGiatProps) {
   const {
      capaian_bl_giat: capaian,
      capaian_bl_giat_murni: capaian_murni,
      output_bl_giat: og,
      output_bl_giat_murni: og_murni,
      hasil_bl_giat: hasil,
      hasil_bl_giat_murni: hasil_murni,
      pagu,
      pagu_murni,
   } = props
   const capaian_length = capaian?.length || 1
   const hasil_length = hasil?.length || 1
   const og_length = og?.length || 1
   const og_murni_length = og_murni?.length || 1
   const capaian_murni_length = capaian_murni?.length || 0
   const hasil_murni_length = hasil_murni?.length || 0
   return (
      <>
         <table className={`min-w-full`}>
            <thead className='text-center font-semibold'>
               <tr className='print:break-inside-avoid'>
                  <th
                     colSpan={6}
                     className='cell-print'>
                     Indikator dan Tolak Ukur Kinerja Kegiatan
                  </th>
               </tr>
               <tr className='font-semibold print:break-inside-avoid'>
                  <th
                     rowSpan={2}
                     className='cell-print'>
                     Indikator
                  </th>
                  <th
                     colSpan={2}
                     className='cell-print'>
                     Sebelum
                  </th>
                  <th
                     colSpan={2}
                     className='cell-print'>
                     Sesudah
                  </th>
               </tr>
               <tr className='whitespace-nowrap font-semibold print:break-inside-avoid'>
                  <th className='cell-print'>Tolok Ukur Kinerja</th>
                  <th className='cell-print'>Target Kinerja</th>
                  <th className='cell-print'>Tolok Ukur Kinerja</th>
                  <th className='cell-print'>Target Kinerja</th>
               </tr>
            </thead>
            <tbody>
               {Array.from(
                  { length: Math.max(capaian_length, capaian_murni_length) },
                  (_, index) => index + 1
               )?.map((__, i) => (
                  <tr
                     key={i}
                     className='print:break-inside-avoid'>
                     {i === 0 && (
                        <td
                           rowSpan={Math.max(capaian_length, capaian_murni_length)}
                           className='cell-print whitespace-nowrap'>
                           Capaian Program
                        </td>
                     )}
                     <td className='cell-print'>
                        {capaian_murni?.length ? capaian_murni[i]?.tolak_ukur : ''}
                     </td>
                     <td className='cell-print'>
                        {capaian_murni?.length ? capaian_murni[i]?.target_teks : ''}
                     </td>
                     <td className='cell-print'>{capaian?.length ? capaian[i]?.tolak_ukur : ''}</td>
                     <td className='cell-print'>
                        {capaian?.length ? capaian[i]?.target_teks : ''}
                     </td>
                  </tr>
               ))}
               <tr className='print:break-inside-avoid'>
                  <td className='cell-print'>Masukan</td>
                  <td className='cell-print'>Dana yang dibutuhkan</td>
                  <td className='cell-print'>Rp{numberToText(pagu_murni)}</td>
                  <td className='cell-print'>Dana yang dibutuhkan</td>
                  <td className='cell-print'>Rp{numberToText(pagu)}</td>
               </tr>

               {Array.from(
                  { length: Math.max(og_length, og_murni_length) },
                  (_, index) => index + 1
               )?.map((__, i) => (
                  <tr
                     key={i}
                     className='print:break-inside-avoid'>
                     {i === 0 && (
                        <td
                           colSpan={Math.max(og_length, og_murni_length)}
                           className='cell-print'>
                           Keluaran
                        </td>
                     )}
                     <td className='cell-print'>
                        {og_murni?.length ? og_murni[i]?.tolok_ukur : ''}
                     </td>
                     <td className='cell-print'>
                        {og_murni?.length ? og_murni[i]?.target_teks : ''}
                     </td>
                     <td className='cell-print'>{og?.length ? og[i]?.tolok_ukur : ''}</td>
                     <td className='cell-print'>{og?.length ? og[i]?.target_teks : ''}</td>
                  </tr>
               ))}

               {Array.from(
                  { length: Math.max(hasil_length, hasil_murni_length) },
                  (_, index) => index + 1
               )?.map((__, i) => (
                  <tr
                     key={i}
                     className='print:break-inside-avoid'>
                     {i === 0 && (
                        <td
                           colSpan={Math.max(hasil_length, hasil_murni_length)}
                           className='cell-print'>
                           Hasil
                        </td>
                     )}
                     <td className='cell-print'>
                        {hasil_murni?.length ? hasil_murni[i]?.tolak_ukur : ''}
                     </td>
                     <td className='cell-print'>
                        {hasil_murni?.length ? hasil_murni[i]?.target_teks : ''}
                     </td>
                     <td className='cell-print'>{hasil?.length ? hasil[i]?.tolak_ukur : ''}</td>
                     <td className='cell-print'>{hasil?.length ? hasil[i]?.target_teks : ''}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         <div className='h-2' />
      </>
   )
}

const TrSubTotal = ({ rinci }: { rinci: any }) => {
   const { group, nama_dana, total_harga, total_harga_murni, uraian, kode, selisih } = rinci || {}
   const totalText = numberToText(total_harga)
   const totalMurniText = numberToText(total_harga_murni)
   const different = selisih ? total_harga - total_harga_murni : 0
   const totalVariationText = numberToText(different, 0, true)

   return (
      <tr
         className={`group font-semibold ${!total_harga_murni && !total_harga ? 'text-danger print:hidden' : ''} print:break-inside-avoid`}>
         <td className='cell-print max-w-fit'>{kode}</td>
         <td
            colSpan={5}
            className='cell-print'>
            {group === 7 ? (
               <div className='flex'>
                  <div className='flex w-5 flex-none items-start justify-between'>
                     <div>[</div>
                     <div>#</div>
                     <div>]</div>
                  </div>
                  <div className='flex-1 pl-0.5'>
                     <div>{uraian}</div>
                     <div className='text-xs italic'>{nama_dana}</div>
                  </div>
               </div>
            ) : group === 8 ? (
               <div className='flex items-center'>
                  <div className='flex w-5 flex-none items-start justify-between'>
                     <div>[</div>
                     <div>-</div>
                     <div>]</div>
                  </div>
                  <div className='flex-1 pl-0.5'>{uraian}</div>
               </div>
            ) : (
               uraian
            )}
         </td>

         <td className={`cell-print max-w-fit text-right`}>{totalMurniText}</td>
         <td
            colSpan={4}
            className='cell-print text-right'></td>
         <td className={`cell-print max-w-fit text-right`}>{totalText}</td>
         <td
            className={`cell-print max-w-fit text-right print:bg-transparent ${different < 0 ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
            {totalVariationText}
         </td>
      </tr>
   )
}

const TrRinci = ({ rinci }: { rinci: any }) => {
   const selisih = rinci?.selisih || 0
   return (
      <tr
         className={`${!rinci.koefisien && !rinci.koefisien_murni ? 'text-danger print:hidden' : ''} print:break-inside-avoid`}>
         <td className='cell-print w-0 text-center'></td>
         <td className='cell-print'>
            <div>{rinci.uraian}</div>
            {rinci.spek && <div className='italic'>Spesifikasi: {rinci.spek ?? '-'}</div>}
         </td>
         <td className='cell-print text-right'>{rinci.volume_murni?.join(' x ')}</td>
         <td className={`cell-print max-w-fit text-right`}>
            {numberToText(rinci.harga_satuan_murni)}
         </td>
         <td className='cell-print'>{rinci.satuan_murni?.join(' ')}</td>
         <td className={`cell-print max-w-fit text-right`}>{numberToText(rinci.pajak_murni)} %</td>
         <td className='cell-print max-w-fit text-right'>
            {numberToText(rinci.total_harga_murni)}
         </td>
         <td className='cell-print text-right'>{rinci.volume?.join(' x ')}</td>
         <td className={`cell-print max-w-fit text-right`}>{numberToText(rinci.harga_satuan)}</td>
         <td className='cell-print max-w-fit'>{rinci.satuan?.join(' ')}</td>
         <td className={`cell-print max-w-fit text-right`}>{numberToText(rinci.pajak)}%</td>
         <td className={`cell-print max-w-fit text-right`}>{numberToText(rinci.total_harga)}</td>
         <td
            className={`cell-print max-w-fit text-right print:bg-transparent ${selisih < 0 ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
            {numberToText(Math.abs(selisih))}
         </td>
      </tr>
   )
}

const RkpaRinciBl: React.FC<Props> = ({ rincian }) => {
   return (
      <>
         <table className='min-w-full'>
            <THeadRincian />
            <tbody>
               {rincian?.map((item, index) => {
                  const isRincian = item.group === 9
                  return (
                     <Fragment key={index + '-' + item.no_urut}>
                        {isRincian ? <TrRinci rinci={item} /> : <TrSubTotal rinci={item} />}
                     </Fragment>
                  )
               })}
            </tbody>
         </table>
         <div className='h-2' />
      </>
   )
}
export default RkpaRinciBl

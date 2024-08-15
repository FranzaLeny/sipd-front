'use client'

import { Fragment } from 'react'
import { numberToText } from '@utils'

import type { LaporanRinciBl } from './rinci-bl'

//
//

export type Props = {
   rincian: LaporanRinciBl['rincian']
   printDeleted: boolean
}

function THeadRincian() {
   return (
      <thead className='font-bold'>
         <tr>
            <th
               className='cell-print w-0'
               rowSpan={2}>
               Kode Rekening
            </th>
            <th
               className='cell-print'
               rowSpan={2}>
               Uraian
            </th>
            <th
               className='cell-print'
               colSpan={4}>
               Rincian Perhitungan
            </th>
            <th
               className='cell-print w-0 whitespace-pre-wrap'
               rowSpan={2}>
               <div>Jumlah</div>
               <div>(Rp)</div>
            </th>
         </tr>
         <tr>
            <th className='cell-print w-0'>Koefisien</th>
            <th className='cell-print w-0'>Harga</th>
            <th className='cell-print w-0'>Satuan</th>
            <th className='cell-print w-0'>PPN</th>
         </tr>
      </thead>
   )
}

interface TableIndikatorGiatProps {
   capaian_bl_giat: { target_teks: string; tolak_ukur: string }[]
   pagu: number
   output_bl_giat: { target_teks: string; tolok_ukur: string }[]
   output_bl_sub_giat: { target_teks: string; tolak_ukur: string }[]
   hasil_bl_giat: { target_teks: string; tolak_ukur: string }[]
   keluaranSub: boolean
}

export function TableIndikatorGiat(props: TableIndikatorGiatProps) {
   const {
      capaian_bl_giat: capaian,
      output_bl_giat: og,
      hasil_bl_giat: hasil,
      pagu,
      output_bl_sub_giat,
      keluaranSub = false,
   } = props
   const capaian_length = capaian?.length || 1
   const hasil_length = hasil?.length || 1
   const og_length = og?.length || 1
   const osbl_length = output_bl_sub_giat?.length || 1
   return (
      <>
         <table className={`min-w-full`}>
            <thead className='text-center font-semibold'>
               <tr className='print:break-inside-avoid'>
                  <th
                     colSpan={3}
                     className='cell-print'>
                     Indikator dan Tolak Ukur Kinerja Kegiatan
                  </th>
               </tr>
               <tr className='font-semibold print:break-inside-avoid'>
                  <th className='cell-print'>Indikator</th>
                  <th className='cell-print'>Tolok Ukur Kinerja</th>
                  <th className='cell-print'>Target Kinerja</th>
               </tr>
            </thead>
            <tbody>
               {Array.from({ length: capaian_length }, (_, index) => index + 1)?.map((__, i) => (
                  <tr
                     key={i}
                     className='print:break-inside-avoid'>
                     {i === 0 && (
                        <td
                           rowSpan={capaian_length}
                           className='cell-print whitespace-nowrap'>
                           Capaian Program
                        </td>
                     )}

                     <td className='cell-print'>
                        {capaian?.length ? capaian[i]?.tolak_ukur : '-'}
                     </td>
                     <td className='cell-print'>
                        {capaian?.length ? capaian[i]?.target_teks : '-'}
                     </td>
                  </tr>
               ))}
               <tr className='print:break-inside-avoid'>
                  <td className='cell-print'>Masukan</td>
                  <td className='cell-print'>Dana yang dibutuhkan</td>
                  <td className='cell-print'>Rp{numberToText(pagu)}</td>
               </tr>

               {Array.from({ length: og_length }, (_, index) => index + 1)?.map((__, i) => (
                  <tr
                     key={i}
                     className='print:break-inside-avoid'>
                     {i === 0 && (
                        <td
                           colSpan={og_length}
                           className='cell-print'>
                           Keluaran
                        </td>
                     )}
                     <td className='cell-print'>{og?.length ? og[i]?.tolok_ukur : '-'}</td>
                     <td className='cell-print'>{og?.length ? og[i]?.target_teks : '-'}</td>
                  </tr>
               ))}

               {Array.from({ length: hasil_length }, (_, index) => index + 1)?.map((__, i) => (
                  <tr
                     key={i}
                     className='print:break-inside-avoid'>
                     {i === 0 && (
                        <td
                           colSpan={hasil_length}
                           className='cell-print'>
                           Hasil
                        </td>
                     )}
                     <td className='cell-print'>{hasil?.length ? hasil[i]?.tolak_ukur : ''}</td>
                     <td className='cell-print'>{hasil?.length ? hasil[i]?.target_teks : ''}</td>
                  </tr>
               ))}
               {keluaranSub &&
                  Array.from({ length: osbl_length }, (_, index) => index + 1)?.map((__, i) => (
                     <tr
                        key={i}
                        className='print:break-inside-avoid'>
                        {i === 0 && (
                           <td
                              colSpan={osbl_length}
                              className='cell-print'>
                              Keluaran Sub kegiatan
                           </td>
                        )}
                        <td className='cell-print'>
                           {output_bl_sub_giat?.length ? output_bl_sub_giat[i]?.tolak_ukur : ''}
                        </td>
                        <td className='cell-print'>
                           {output_bl_sub_giat?.length ? output_bl_sub_giat[i]?.target_teks : ''}
                        </td>
                     </tr>
                  ))}
            </tbody>
         </table>
         <div className='h-2' />
      </>
   )
}

const TrSubTotal = ({
   rinci,
   printDeleted,
}: {
   rinci: Props['rincian'][number]
   printDeleted: boolean
}) => {
   const { group, nama_dana, total_harga, uraian, kode, is_deleted } = rinci || {}
   const totalText = numberToText(total_harga)

   return (
      <tr
         className={`group font-semibold print:break-inside-avoid ${is_deleted && 'line-through print:no-underline'}  ${!printDeleted && is_deleted && 'print:hidden'}`}>
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

         <td className={`cell-print max-w-fit text-right`}>{totalText}</td>
      </tr>
   )
}

const TrRinci = ({
   rinci,
   printDeleted,
}: {
   rinci: Props['rincian'][number]
   printDeleted: boolean
}) => {
   return (
      <tr
         className={`${!rinci.is_deleted && 'ine-through print:no-underline'}  ${!printDeleted && rinci.is_deleted && 'print:hidden'} print:break-inside-avoid`}>
         <td className='cell-print w-0 text-center'></td>
         <td className='cell-print'>
            <div>{rinci.uraian}</div>
            {rinci.spek && <div className='italic'>Spesifikasi: {rinci.spek ?? '-'}</div>}
         </td>
         <td className='cell-print text-right'>{rinci.volume?.join(' x ')}</td>
         <td className={`cell-print max-w-fit text-right`}>{numberToText(rinci.harga_satuan)}</td>
         <td className='cell-print max-w-fit'>{rinci.satuan?.join(' ')}</td>
         <td className={`cell-print max-w-fit text-right`}>{numberToText(rinci.pajak)}%</td>
         <td className={`cell-print max-w-fit text-right`}>{numberToText(rinci.total_harga)}</td>
      </tr>
   )
}

const RkaRinciBl: React.FC<Props> = ({ rincian, printDeleted }) => {
   return (
      <>
         <table className='min-w-full'>
            <THeadRincian />
            <tbody>
               {rincian?.map((item, index) => {
                  const isRincian = item.group === 9
                  return (
                     <Fragment key={index + '-' + item.no_urut}>
                        {isRincian ? (
                           <TrRinci
                              printDeleted={printDeleted}
                              rinci={item}
                           />
                        ) : (
                           <TrSubTotal
                              printDeleted={printDeleted}
                              rinci={item}
                           />
                        )}
                     </Fragment>
                  )
               })}
            </tbody>
         </table>
         <div className='h-2' />
      </>
   )
}
export default RkaRinciBl

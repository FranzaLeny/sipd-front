import { Fragment } from 'react'
import { numberToText } from '@shared/utils'

interface Props {
   printPreview: boolean
   capaian_bl_giat: { target_teks: string; tolak_ukur: string }[]
   capaian_bl_giat_murni: { target_teks: string; tolak_ukur: string }[]
   pagu: number
   pagu_murni?: number
   output_bl_giat: { target_teks: string; tolok_ukur: string }[]
   output_bl_giat_murni: { target_teks: string; tolok_ukur: string }[]
   hasil_bl_giat: { target_teks: string; tolak_ukur: string }[]
   hasil_bl_giat_murni: { target_teks: string; tolak_ukur: string }[]
}

export default function TableIndikatorGiat(
   props: Pick<
      Props,
      Exclude<
         keyof Props,
         'output_bl_giat_murni' | 'hasil_bl_giat_murni' | 'capaian_bl_giat_murni' | 'pagu_murni'
      >
   >
) {
   const {
      capaian_bl_giat: capaian,
      hasil_bl_giat: hasil,
      output_bl_giat: output,
      pagu,
      printPreview,
   } = props
   const capaian_length = capaian?.length || 0
   const output_length = output?.length || 0
   const hasil_length = hasil?.length || 0

   return (
      <table className={`min-w-full ${!printPreview && 'hidden print:table'}`}>
         <thead className='text-center font-semibold'>
            <tr className='font-semibold print:break-inside-avoid'>
               <th
                  colSpan={3}
                  className='cell-print'>
                  Indikator dan Tolak Ukur Kinerja Kegiatan
               </th>
            </tr>
            <tr className='whitespace-nowrap font-semibold print:break-inside-avoid'>
               <th className='cell-print'>Indikator</th>
               <th className='cell-print'>Tolok Ukur Kinerja</th>
               <th className='cell-print'>Target Kinerja</th>
            </tr>
         </thead>
         <tbody>
            <tr className='print:break-inside-avoid'>
               <td
                  colSpan={0}
                  className='cell-print whitespace-nowrap'>
                  Capaian Program
               </td>
               {capaian_length ? (
                  capaian?.map((item, i) => (
                     <Fragment key={i}>
                        <td className='cell-print'>{item.tolak_ukur}</td>
                        <td className='cell-print'>{item.target_teks}</td>
                     </Fragment>
                  ))
               ) : (
                  <>
                     <td className='cell-print'></td>
                     <td className='cell-print'></td>
                  </>
               )}
            </tr>
            <tr className='print:break-inside-avoid'>
               <td className='cell-print'>Masukan</td>
               <td className='cell-print'>Dana yang dibutuhkan</td>
               <td className='cell-print'>Rp.{numberToText(pagu)}</td>
            </tr>
            <tr className='print:break-inside-avoid'>
               <td
                  colSpan={output_length}
                  className='cell-print'>
                  Keluaran
               </td>
               {output_length ? (
                  output?.map((item, i) => (
                     <Fragment key={i}>
                        <td className='cell-print'>{item.tolok_ukur}</td>
                        <td className='cell-print'>{item.target_teks}</td>
                     </Fragment>
                  ))
               ) : (
                  <>
                     <td className='cell-print'></td>
                     <td className='cell-print'></td>
                  </>
               )}
            </tr>
            <tr className='print:break-inside-avoid'>
               <td
                  colSpan={hasil_length}
                  className='cell-print'>
                  Hasil
               </td>
               {hasil_length ? (
                  hasil?.map((item, i) => (
                     <Fragment key={i}>
                        <td className='cell-print'>{item.tolak_ukur}</td>
                        <td className='cell-print'>{item.target_teks}</td>
                     </Fragment>
                  ))
               ) : (
                  <>
                     <td className='cell-print'></td>
                     <td className='cell-print'></td>
                  </>
               )}
            </tr>
         </tbody>
      </table>
   )
}

export function TableIndikatorGiatPerubahan(props: Props) {
   const {
      capaian_bl_giat: capaian,
      hasil_bl_giat: hasil,
      output_bl_giat: output,
      pagu,
      capaian_bl_giat_murni: capaian_murni,
      hasil_bl_giat_murni: hasil_murni,
      output_bl_giat_murni: output_murni,
      pagu_murni,
      printPreview,
   } = props
   const capaian_length = capaian?.length || 1
   const output_length = output?.length || 1
   const hasil_length = hasil?.length || 1
   const capaian_murni_length = capaian_murni?.length || 0
   const output_murni_length = output_murni?.length || 0
   const hasil_murni_length = hasil_murni?.length || 0
   return (
      <table className={`min-w-full ${!printPreview && 'hidden print:table'}`}>
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
                  Sebelum Perubahan
               </th>
               <th
                  colSpan={2}
                  className='cell-print'>
                  Sesudah Perubahan
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
            )?.map((item, i) => (
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
                  <td className='cell-print'>{capaian?.length ? capaian[i]?.target_teks : ''}</td>
               </tr>
            ))}
            <tr className='print:break-inside-avoid'>
               <td className='cell-print'>Masukan</td>
               <td className='cell-print'>Dana yang dibutuhkan</td>
               <td className='cell-print'>Rp.{numberToText(pagu_murni)}</td>
               <td className='cell-print'>Dana yang dibutuhkan</td>
               <td className='cell-print'>Rp.{numberToText(pagu)}</td>
            </tr>

            {Array.from(
               { length: Math.max(output_length, output_murni_length) },
               (_, index) => index + 1
            )?.map((item, i) => (
               <tr
                  key={i}
                  className='print:break-inside-avoid'>
                  {i === 0 && (
                     <td
                        colSpan={Math.max(output_length, output_murni_length)}
                        className='cell-print'>
                        Keluaran
                     </td>
                  )}
                  <td className='cell-print'>
                     {output_murni?.length ? output_murni[i]?.tolok_ukur : ''}
                  </td>
                  <td className='cell-print'>
                     {output_murni?.length ? output_murni[i]?.target_teks : ''}
                  </td>
                  <td className='cell-print'>{output?.length ? output[i]?.tolok_ukur : ''}</td>
                  <td className='cell-print'>{output?.length ? output[i]?.target_teks : ''}</td>
               </tr>
            ))}

            {Array.from(
               { length: Math.max(hasil_length, hasil_murni_length) },
               (_, index) => index + 1
            )?.map((item, i) => (
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
   )
}

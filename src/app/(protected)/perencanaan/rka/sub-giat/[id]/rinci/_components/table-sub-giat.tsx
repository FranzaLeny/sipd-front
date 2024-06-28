import { numberToMonth, numberToText } from '@shared/utils'

import { DataType } from './sub-giat'

function TrGiat({ label, children }: { label: string; children: React.ReactNode }) {
   return (
      <tr className='border-print align-top print:break-inside-avoid'>
         <td className='whitespace-nowrap px-1.5 py-0.5'>{label}</td>
         <td className='w-5 py-0.5 text-center'>:</td>
         <td className='py-0.5 pr-1.5'>{children}</td>
      </tr>
   )
}
type Props = DataType
export default function TableSubGiat({
   subKegiatan = {} as any,
}: {
   subKegiatan: Props['sub_kegiatan']
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
   } = subKegiatan
   return (
      <table className='min-w-full'>
         <tbody>
            <tr className='border-print font-semibold print:break-inside-avoid'>
               <td
                  colSpan={3}
                  className='cell-print border py-0.5 text-center'>
                  Rincian Anggaran Belanja Kegiatan Satuan Kerja Perangkat Daerah
               </td>
            </tr>
            <TrGiat label='Sub Kegiatan'>
               {kode_sub_giat} {nama_sub_giat}
            </TrGiat>
            <TrGiat label='Sumber Pendanaan'>
               {dana_bl_sub_giat?.map((item, i) => (
                  <div key={i}>
                     {item.nama_dana}
                     <span className='font-bold print:hidden'>
                        {' '}
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
            <TrGiat label='Keterangan'>
               {tag_bl_sub_giat?.map((item, i) => <div key={i}>{item.nama_label_giat}</div>)}
            </TrGiat>
            <TrGiat label='Waktu Pelaksanaan'>
               {numberToMonth(waktu_awal)} s.d {numberToMonth(waktu_akhir)}
            </TrGiat>
         </tbody>
      </table>
   )
}

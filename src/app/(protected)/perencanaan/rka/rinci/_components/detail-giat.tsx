import { numberToMonth, numberToText } from '@shared/utils'

import { SubGiatWithRinci } from './rincian'

type Props = SubGiatWithRinci
export default function DetailGiat({
   subKegiatan = {} as any,
}: {
   subKegiatan: Props['sub_kegiatan']
}) {
   const {
      kode_urusan,
      nama_urusan,
      kode_bidang_urusan,
      nama_bidang_urusan,
      kode_skpd,
      nama_skpd,
      kode_sub_skpd,
      nama_sub_skpd,
      kode_program,
      nama_program,
      kode_giat,
      nama_giat,
      kode_sub_giat,
      nama_sub_giat,
      dana_bl_sub_giat,
      waktu_awal,
      waktu_akhir,
      tahun,
      pagu_n_lalu,
      pagu_n_depan,
      pagu,
      lokasi_bl_sub_giat,
      sasaran,
   } = subKegiatan
   return (
      <>
         <TrGiat label='Urusan Pemerintahan'>
            {kode_urusan} {nama_urusan}
         </TrGiat>
         <TrGiat label='Bidang Urusan'>
            {kode_bidang_urusan} {nama_bidang_urusan}
         </TrGiat>
         <TrGiat label='Unit Organisasi'>
            {kode_skpd} {nama_skpd}
         </TrGiat>
         <TrGiat label='Sub Organisasi'>
            {kode_sub_skpd} {nama_sub_skpd}
         </TrGiat>
         <TrGiat label='Program'>
            {kode_program} {nama_program}
         </TrGiat>
         <TrGiat label='Kegiatan'>
            {kode_giat} {nama_giat}
         </TrGiat>
         <TrGiat label='Sub Kegiatan'>
            {kode_sub_giat} {nama_sub_giat}
         </TrGiat>
         <TrGiat label='SPM'>-</TrGiat>
         <TrGiat label='Jenis Layanan'>-</TrGiat>
         <TrGiat label='Sumber Pendanaan'>
            {dana_bl_sub_giat?.map((d, i) => <div key={i}>{d.nama_dana}</div>)}
         </TrGiat>
         <TrGiat label='Lokasi'>
            {lokasi_bl_sub_giat?.map((d, i) => (
               <div key={i}>
                  {d.kab_kota?.nama_daerah ?? 'Semua Kabupaten'}
                  {', '}
                  {d.kecamatan?.camat_teks ?? 'Semua Kecamatan'}
                  {', '}
                  {d.lurah?.lurah_teks ?? 'Semua Kelurahan'}
               </div>
            ))}
         </TrGiat>
         <TrGiat label='Waktu Pelaksanaan'>
            {numberToMonth(waktu_awal)} s.d {numberToMonth(waktu_akhir)}
         </TrGiat>
         <TrGiat label='Kelompok Sasaran'>{sasaran}</TrGiat>
         <TrGiat label={`Alokasi ${tahun - 1}`}>Rp{numberToText(pagu_n_lalu)}</TrGiat>
         <TrGiat label={`Alokasi ${tahun}`}>Rp{numberToText(pagu)}</TrGiat>
         <TrGiat label={`Alokasi ${tahun + 1}`}>Rp{numberToText(pagu_n_depan)}</TrGiat>
      </>
   )
}

function TrGiat({ label, children }: { label: string; children: React.ReactNode }) {
   return (
      <tr className='border-print print:break-inside-avoid'>
         <td className='whitespace-nowrap px-1.5 py-0.5'>{label}</td>
         <td className='w-5  py-0.5 text-center'>:</td>
         <td className='py-0.5 pr-1.5'>{children}</td>
      </tr>
   )
}

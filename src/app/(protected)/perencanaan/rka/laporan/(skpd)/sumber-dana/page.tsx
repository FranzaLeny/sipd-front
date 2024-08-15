import { getLaporanSumberDana } from '@actions/perencanaan/rka/laporan'
import ErrorPage from '@components/ui/error'

import RekapDana from './rekap-dana'

export const metadata = {
   title: 'Rekapan Sumber Dana',
}

interface Props {
   searchParams: SearchParams
}
export const revalidate = 0
interface SearchParams {
   jadwal_anggaran_id: string
   id_skpd: string
   id_unit: string
   tahun: string
}

export default async function Page(props: Props) {
   if (!props?.searchParams?.jadwal_anggaran_id || !props?.searchParams?.id_unit) {
      return <div className='content text-danger mx-auto p-8'>Pilih Jadwal dan SKPD</div>
   }
   const data = await getLaporanSumberDana(props?.searchParams).catch((e) => {
      let errorCode = 500
      e.response?.status && (errorCode = e.response?.status)
      return { errorCode, message: e?.message }
   })

   if ('errorCode' in data) {
      return (
         <ErrorPage
            code={data.errorCode}
            description={data?.message}
         />
      )
   }
   if (!data?.sumber_dana?.length) {
      const skpd = data?.skpd?.sub_skpd?.nama_skpd
      const jadwal = data?.jadwal?.nama_sub_tahap
      return (
         <div className='content text-danger mx-auto p-8'>
            <p className='max-w-sm text-center'>
               Tidak ada data untuk <span className='text-foreground font-bold'>{skpd}</span> pada
               jadwal: <span className='text-foreground '>{jadwal}</span>
            </p>
         </div>
      )
   }

   return (
      <RekapDana
         sumberDana={data.sumber_dana}
         tahun={data?.jadwal?.tahun}
         skpd={data?.skpd?.unit}
         jadwal={data?.jadwal?.nama_sub_tahap}
      />
   )
}

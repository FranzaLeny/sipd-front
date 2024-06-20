import { getLaporanSkpd } from '@actions/perencanaan/rka/laporan'
import ErrorPage from '@components/ui/error'

import RkaSkpd from './rka-skpd'

export const metadata = {
   title: 'Ringkasan SKPD',
}

interface Props {
   searchParams: SearchParams
}

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
   const data = await getLaporanSkpd(props?.searchParams).catch((e) => {
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
   const jadwalTipe = !!data?.jadwal?.is_perubahan ? 'perubahan' : 'murni'
   if (!data?.list_rekapan?.length) {
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
      <RkaSkpd
         anggotaTapd={data?.skpd?.tapd}
         skpd={data?.skpd?.sub_skpd}
         unit={data?.skpd?.unit}
         listRekapan={data?.list_rekapan}
         tahun={data?.jadwal?.tahun}
         jadwalTipe={jadwalTipe}
      />
   )
}

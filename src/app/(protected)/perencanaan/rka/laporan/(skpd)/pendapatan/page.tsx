import { getLaporanPendapatanSkpd } from '@actions/perencanaan/rka/laporan'
import ErrorPage from '@components/ui/error'

import RkaPendapatan from './rka-pendapatan'

export const metadata = {
   title: 'Pendapatan SKPD',
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
   const data = await getLaporanPendapatanSkpd(props?.searchParams).catch((e) => {
      let errorCode = 500
      e.response?.status && (errorCode = e.response?.status)
      return { errorCode, message: e?.message }
   })

   if (data && 'errorCode' in data) {
      return (
         <ErrorPage
            code={data.errorCode}
            description={data?.message}
         />
      )
   }
   const jadwalTipe = !!data?.jadwal?.is_perubahan ? 'perubahan' : 'murni'

   return (
      <RkaPendapatan
         anggotaTapd={data?.skpd?.tapd}
         jadwalTipe={jadwalTipe}
         listPendapatan={data?.list_pendapatan}
         skpd={data?.skpd?.sub_skpd}
         tahun={data?.jadwal?.tahun}
         unit={data?.skpd?.unit}
      />
   )
}

import { getLaporanBelanjaSkpd } from '@actions/perencanaan/rka/laporan'
import ErrorPage from '@components/ui/error'

import RkaRekapBl from './rka-rekap-bl'

export const metadata = {
   title: 'Laporan Rekapan Belanja',
}

interface Props {
   params: Params
   searchParams: SearchParams
}

interface SearchParams {
   jadwal_anggaran_id: string
   id_skpd: number
   id_unit: number
   tahun: number
}

interface Params {}

export default async function Page(props: Props) {
   if (!props?.searchParams?.jadwal_anggaran_id || !props?.searchParams?.id_unit) {
      return <div className='content text-danger mx-auto p-8'>Pilih Jadwal dan SKPD</div>
   }
   const data = await getLaporanBelanjaSkpd(props?.searchParams).catch((e) => {
      console.log(e)

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

   return (
      <RkaRekapBl
         jadwalTipe={jadwalTipe}
         listBl={data?.list_bl}
         skpd={data?.skpd?.sub_skpd}
         tahun={data?.jadwal?.tahun}
         anggotaTapd={data?.skpd?.tapd}
         unit={data?.skpd?.unit}
      />
   )
}

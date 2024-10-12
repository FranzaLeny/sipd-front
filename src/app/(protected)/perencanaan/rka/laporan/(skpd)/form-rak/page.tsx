import { getLaporanFormRak } from '@actions/perencanaan/rka/laporan'
import ErrorPage from '@components/ui/error'

import Rak from './client'

export const metadata = {
   title: 'FORM RAK',
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

   const data = await getLaporanFormRak(props?.searchParams).catch((e) => {
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

   return <Rak data={data} />
}

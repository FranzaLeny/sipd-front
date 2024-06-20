import { getSkpd } from '@actions/perencanaan/data/skpd'
import FrormSkpd from '@components/perencanaan/form-skpd'
import ErrorPage from '@components/ui/error'

export const metadata = {
   title: 'Ubah SKPD',
}
export const dynamic = 'force-dynamic'
export const revalidate = 0
export default async function Page({ params: { id } }: { params: { id: string } }) {
   const data = await getSkpd(id).catch((e) => {
      let errorCode = 500
      e.response?.status && (errorCode = e.response?.status)
      return { errorCode, message: e?.message }
   })

   if ('errorCode' in data) {
      return (
         <ErrorPage
            code={data?.errorCode}
            description={data?.message}
         />
      )
   }
   return (
      <FrormSkpd
         defaultValues={data}
         title={`UBAH DATA ${data?.nama_skpd}`}
      />
   )
}

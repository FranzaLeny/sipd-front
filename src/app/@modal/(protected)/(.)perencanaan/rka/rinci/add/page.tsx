import { getBlSubGiatById } from '@actions/perencanaan/rka/bl-sub-giat'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import ModalAddRincian from '@/app/(protected)/perencanaan/rka/rinci/add/_components'

interface Props {
   searchParams: SearchParams
}

interface SearchParams {
   bl_sub_giat_id: string
}

const Page = async ({ searchParams: { bl_sub_giat_id } }: Props) => {
   const data = await getBlSubGiatById(bl_sub_giat_id).catch((e) => {
      let errorCode = 500
      e.response?.status && (errorCode = e.response?.status)
      return { errorCode, message: e?.message }
   })
   if ('errorCode' in data) {
      return (
         <ErrorPage
            code={data.errorCode}
            description={data.message}
         />
      )
   }
   const { user } = await getServerSession()

   if (!!!user || data?.tahun !== user?.tahun) {
      return <ErrorPage code={403} />
   }
   return <ModalAddRincian data={data} />
}

export default Page

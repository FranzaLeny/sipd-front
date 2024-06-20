import { getBlSubGiatById } from '@actions/perencanaan/rka/bl-sub-giat'
import ErrorPage from '@components/ui/error'

import ModalAddRincian from './_components'

interface Props {
   params: Params
}

interface Params {
   id: string
}

const Page = async ({ params: { id } }: Props) => {
   const data = await getBlSubGiatById(id).catch((e) => {
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
   return <ModalAddRincian data={data} />
}

export default Page

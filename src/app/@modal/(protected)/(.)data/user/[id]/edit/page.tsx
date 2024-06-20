import { getUser } from '@actions/data/user'
import ErrorPage from '@components/ui/error'
import { getServerSession } from '@shared/server-actions/auth'

import ModalEdit from './_components'

interface Props {
   params: Params
}

interface Params {
   id: string
}

const PageEdit = async ({ params: { id } }: Props) => {
   const { hasAccess, user } = await getServerSession(['super_admin', 'admin'])
   if (!hasAccess) return <ErrorPage code={403} />
   const data = await getUser(id)
      .then((d) => d?.data)
      .catch((e: any) => {
         let erroCode = 500
         e?.response?.status && (erroCode = e?.response?.status)
         return { errorCode: erroCode, message: e?.message }
      })
   if ('errorCode' in data) {
      return (
         <ErrorPage
            code={data.errorCode}
            description={data.message}
         />
      )
   }

   return (
      <ModalEdit
         data={data}
         roles={user.roles}
      />
   )
}

export default PageEdit

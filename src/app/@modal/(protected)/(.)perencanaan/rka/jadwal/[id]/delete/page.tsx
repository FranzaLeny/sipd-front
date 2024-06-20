import { getJadwalAnggaranById } from '@actions/perencanaan/rka/jadwal-anggaran'
import ErrorPage from '@components/ui/error'
import { pick } from 'lodash-es'
import { getServerSession } from '@shared/server-actions/auth'

import ModalDelete from './_components'

interface Props {
   params: Params
}

interface Params {
   id: string
}

const PageDelete = async ({ params: { id } }: Props) => {
   const { hasAccess, user } = await getServerSession(['super_admin', 'admin', 'admin_perencanaan'])
   if (!hasAccess) return <ErrorPage code={403} />
   const data = await getJadwalAnggaranById(id)
      .then((d) => d?.data)
      .catch((e) => {
         let errorCode = 404
         if (e.response.data.code) errorCode = e.response.data.code
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

   return (
      <ModalDelete
         jadwal={pick(data, [
            'id',
            'nama_sub_tahap',
            'is_active',
            'is_locked',
            'is_lokal',
            'id_daerah',
         ])}
         user={user}
      />
   )
}

export default PageDelete

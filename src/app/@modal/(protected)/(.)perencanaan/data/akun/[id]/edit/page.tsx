import { getAkun } from '@actions/perencanaan/data/akun'

import ModalEdit from './modal-edit'

interface Props {
   params: Params
}

interface Params {
   id: string
}
// TODO Page DELETE AKUN DATA PERENCANAAN
const Page = async ({ params: { id } }: Props) => {
   const akun = await getAkun(id)
   return <ModalEdit akun={akun} />
}

export default Page

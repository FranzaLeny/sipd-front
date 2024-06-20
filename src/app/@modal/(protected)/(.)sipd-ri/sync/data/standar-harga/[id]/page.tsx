import { notFound } from 'next/navigation'
import { getStandarHargaById } from '@actions/perencanaan/data/standar-harga'

import MappingAkun from './_components'

interface Props {
   params: Params
}

interface Params {
   id: string
}

const Page = async ({ params: { id } }: Props) => {
   const standar_harga = await getStandarHargaById(id).catch(() => {
      return notFound()
   })
   if (!standar_harga.is_sipd) {
      return notFound()
   }

   return <MappingAkun standar_harga={standar_harga} />
}
export default Page

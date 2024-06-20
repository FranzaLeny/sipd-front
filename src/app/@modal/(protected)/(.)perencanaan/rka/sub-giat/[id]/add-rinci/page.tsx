import { getBlSubGiatById } from '@actions/perencanaan/rka/bl-sub-giat'

import ModalAddRincian from '@/app/(protected)/perencanaan/rka/sub-giat/[id]/add-rinci/_components'

interface Props {
   params: Params
}

interface Params {
   id: string
}

const Page = async ({ params: { id } }: Props) => {
   const data = await getBlSubGiatById(id)
   if (!data) {
      return <div>Tidak ada sub kegiatan</div>
   }
   return <ModalAddRincian data={data} />
}

export default Page

import Breadcrumb from '@components/ui/Breadcrumbs'

import SubGiat from './_components/sub-giat'

const PATHS = [
   { title: 'Perencanaan' },
   { title: 'RKA' },
   { path: '/perencanaan/rka/sub-giat', title: 'Sub Kegiatan' },
   { title: 'Rincian' },
]

export const metadata = {
   title: 'Rincian Sub Kegiatan',
}

export default async function Page({ params: { id } }: { params: { id: string } }) {
   return (
      <>
         <Breadcrumb paths={PATHS} />
         <SubGiat idSubGiat={id} />
      </>
   )
}

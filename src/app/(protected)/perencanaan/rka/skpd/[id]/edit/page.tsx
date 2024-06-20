import { getBlSkpd } from '@actions/perencanaan/rka/bl-skpd'
import { Input } from '@nextui-org/react'

export default async function Page({ params: { id } }: { params: { id: string } }) {
   const data = await getBlSkpd(id)

   return (
      <div className='content w-1/2 space-y-3'>
         <Input
            label='Nama Skpd'
            value={data?.nama_skpd}
         />
         <Input
            label='Pagu Skpd'
            value={data?.set_pagu_skpd?.toLocaleString()}
         />
      </div>
   )
}

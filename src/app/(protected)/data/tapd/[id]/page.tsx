import { getTapdAnggaran } from '@actions/data/tapd'
import { FormTapd } from '@components/master/tapd'

export default async function TapdSettings({ params: { id } }: { params: { id: string } }) {
   const data = await getTapdAnggaran(id)
   return (
      <div className='content relative z-0 space-y-3'>
         <FormTapd
            defaulValue={data?.data}
            isReadOnly
         />
      </div>
   )
}

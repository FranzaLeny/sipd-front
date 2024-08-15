import { getAuthDaerah } from '@actions/data/lokasi'

import FormLogin from './form'

export const dynamic = 'force-dynamic'
const Page = async () => {
   const listDaerah = await getAuthDaerah().catch((e) => {
      console.log(e)

      return []
   })
   return <FormLogin listDaerah={listDaerah} />
}
export default Page

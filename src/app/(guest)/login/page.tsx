import { getDaerahLogin } from '@shared/server-actions/auth-api'

import FormLogin from './form'

interface PageProps {
   searchParams: SearchParams
}

interface SearchParams {
   callbackUrl?: string
   error?: string
}

const Page = async (props: PageProps) => {
   const listDaerah = await getDaerahLogin().catch((e) => {
      console.log(e)

      return []
   })
   return <FormLogin listDaerah={listDaerah} />
}
export default Page

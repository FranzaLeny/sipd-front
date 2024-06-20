import FormLogin from './form'

interface PageProps {
   searchParams: SearchParams
}

interface SearchParams {
   callbackUrl?: string
   error?: string
}

const Page = async (props: PageProps) => {
   return <FormLogin />
}
export default Page

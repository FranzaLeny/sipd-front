import DialogCommingSoon from '@components/modal/dialog-coming-soon'

interface Props {
   params: Params
}

interface Params {
   id: string
}
// TODO Modal DETAIL AKUN DATA PERENCANAAN
const Page = ({ params: { id } }: Props) => {
   return <DialogCommingSoon title='Detail Data Akun' />
}

export default Page

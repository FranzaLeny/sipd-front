import DialogCommingSoon from '@components/modal/dialog-coming-soon'
import DialogShow from '@components/modal/dialog-show'

interface Props {
   params: Params
}

interface Params {
   id: string
}

// TODO Modal DETAIL TAHAPAN DATA PERENCANAAN
const Page = ({ params: { id } }: Props) => {
   return <DialogCommingSoon title='Detail Data Tahapan' />
}

export default Page

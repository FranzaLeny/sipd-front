import DialogCommingSoon from '@components/modal/dialog-coming-soon'

interface Props {
   params: Params
}

interface Params {
   id: string
}
// TODO Page EDIT ROLE
const Page = ({ params: { id } }: Props) => {
   return <DialogCommingSoon title='Ubah Data Pangkat' />
}

export default Page

import DialogCommingSoon from '@components/modal/dialog-coming-soon'

interface Props {
   params: Params
}

interface Params {
   id: string
}

// TODO Page DELETE TAHAPAN DATA PERENCANAAN
const Page = ({ params: { id } }: Props) => {
   return <DialogCommingSoon title='Hapus Data Tahapan' />
}

export default Page

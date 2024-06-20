import DialogCommingSoon from '@components/modal/dialog-coming-soon'

interface Props {
   params: Params
}

interface Params {
   id: string
}

// TODO Modal DELETE USER-SIPD PERENCANAAN
const Page = ({ params: { id } }: Props) => {
   return <DialogCommingSoon title='Delete Data User' />
}

export default Page

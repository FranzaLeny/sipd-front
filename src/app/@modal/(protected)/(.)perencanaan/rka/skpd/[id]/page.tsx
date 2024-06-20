import DialogShow from '@components/modal/dialog-show'

interface Props {
   params: Params
}

interface Params {
   id: string
}

const Page = ({ params: { id } }: Props) => {
   return (
      <DialogShow
         size='2xl'
         header='Lihat'>
         <div>{id}</div>
      </DialogShow>
   )
}

export default Page

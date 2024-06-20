import DialogShow from '@components/modal/dialog-show'

interface Props {
   params: Params
}

interface Params {
   id: string
}

const ModalDelete = ({ params: { id } }: Props) => {
   return (
      <DialogShow
         size='2xl'
         header='Delete'>
         <div>{id}</div>
      </DialogShow>
   )
}

export default ModalDelete

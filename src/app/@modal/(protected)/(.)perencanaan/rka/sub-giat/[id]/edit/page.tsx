import DialogShow from '@components/modal/dialog-show'

interface Props {
   params: Params
}

interface Params {
   id: string
}

const ModalEdit = ({ params: { id } }: Props) => {
   return (
      <DialogShow
         size='2xl'
         header='Edit'>
         <div>{id}</div>
      </DialogShow>
   )
}

export default ModalEdit

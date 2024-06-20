import DialogShow from '@components/modal/dialog-show'

interface Props {
   params: Params
}

interface Params {
   id: string
}
// TODO Modal DETAIL Satuan DATA PERENCANAAN
const ModalView = ({ params: { id } }: Props) => {
   return (
      <DialogShow
         size='2xl'
         header='View'>
         <div>{id}</div>
      </DialogShow>
   )
}

export default ModalView

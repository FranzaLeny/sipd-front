import Loading from '@components/ui/loading'

const ModalLoading = () => {
   return (
      <Loading
         className='fixed inset-0 z-[999] h-max min-h-dvh'
         color='danger'>
         Mohon tunggu...
      </Loading>
   )
}

export default ModalLoading

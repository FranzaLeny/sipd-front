'use client'

import { useCallback } from 'react'
import { deleteUser } from '@actions/data/user'
import DialogConfirm from '@components/modal/dialog-confirm'
import { toast } from 'react-toastify'

interface Props {
   params: Params
}

interface Params {
   id: string
}
const ModalDelete = ({ params: { id } }: Props) => {
   const action = useCallback(async () => {
      try {
         const res = await deleteUser(id)
         toast.success(res?.message)
         return true
      } catch (error: any) {
         toast.error(error?.message || 'Gagal singkron data akun')
         return false
      }
   }, [id])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={false}
         data_key={['user']}
         header='Hapus User'>
         <p className='border-warning rounded-small border p-1 text-center'>PERHATIAN!!</p>

         <p className='text-small'>Data user akan di hapus. Apakah anda yakin?</p>
      </DialogConfirm>
   )
}
export default ModalDelete

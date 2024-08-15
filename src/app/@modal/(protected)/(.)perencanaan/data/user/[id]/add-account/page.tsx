'use client'

import { useCallback } from 'react'
import { addUserByAkunSipdRi } from '@actions/data/user'
import DialogConfirm from '@components/modal/dialog-confirm'
import { toast } from 'react-toastify'

const ModalAddAccount = ({ params: { id } }: { params: { id: string } }) => {
   const action = useCallback(async () => {
      try {
         await addUserByAkunSipdRi(id).then((res) => {
            toast(res.message, { type: res?.success ? 'success' : 'error' })
         })

         return true
      } catch (error: any) {
         console.log({ error })

         toast.error(error?.message || 'Gagal singkron data akun')
         toast.done('singkron_data')
         return false
      }
   }, [id])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={false}
         data_key={['user', 'user_sipd_perencanaan']}
         header='Buat Akun User'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Saat proses tidak dapat dibatalkan.</span>
         </p>

         <p className='text-small'>
            Data Akun akan diganti dengan data dari SIPD-RI.. Apakah anda yakin?
         </p>
      </DialogConfirm>
   )
}
export default ModalAddAccount

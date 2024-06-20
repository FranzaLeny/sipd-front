'use client'

import { useCallback } from 'react'
import { deleteTapdAnggaran } from '@actions/data/tapd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const ModalSingkron = ({ params: { id } }: { params: { id: string } }) => {
   const { data: session } = useSession()

   const action = useCallback(async () => {
      try {
         const res = await deleteTapdAnggaran(id)
         toast(res?.message || 'Berhasil', { type: res?.success ? 'success' : 'error' })
         return res?.success
      } catch (error: any) {
         toast.error(error.message || 'Gagal')
         return false
      }
   }, [id])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!session?.user}
         data_key={['tapd_anggaran', 'perencanaan']}
         header='Hapus data TAPD Anggaran'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Saat proses tidak dapat dibatalkan.</span>
         </p>
         <p className='text-small'>Data TAPD Anggaran ini akan dihapus.. Apakah anda yakin?</p>
      </DialogConfirm>
   )
}
export default ModalSingkron

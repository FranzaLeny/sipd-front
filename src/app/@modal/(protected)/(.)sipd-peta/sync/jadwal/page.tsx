'use client'

import { useCallback } from 'react'
import { syncJadwalAnggaranPenatausahaan } from '@actions/perencanaan/rka/jadwal-anggaran'
import { validateSipdPetaSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const ModalSingkronJadwal = () => {
   const { data: session } = useSession(['admin', 'super_admin', 'sipd_peta'])
   const action = useCallback(async () => {
      toast(
         <div>
            <p className='text-sm font-bold'>Mohon tunggu...</p>
            <p className='text-xs'>Sedang singkron data Anggaran Penatausahaan</p>
         </div>,
         { toastId: 'singkron_data', isLoading: true }
      )
      try {
         const { id_daerah, tahun } = validateSipdPetaSession(session)
         await syncJadwalAnggaranPenatausahaan({ id_daerah, tahun })
         toast.update('singkron_data', {
            render: (
               <div>
                  <p className='text-sm font-bold'>Berhasil...</p>
                  <p className='text-xs'>Selesai Singkron Data Anggaran Penatausahaan</p>
               </div>
            ),
            isLoading: false,
            autoClose: 2000,
            type: 'success',
         })
         return true
      } catch (error: any) {
         toast.update('singkron_data', {
            render: (
               <div>
                  <p className='text-sm font-bold'>Gagal...</p>
                  <p className='text-xs'>{error?.message}</p>
               </div>
            ),
            isLoading: false,
            autoClose: 2000,
            type: 'error',
         })
         return false
      }
   }, [session])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!session}
         data_key={['jadwal_anggaran', 'rka']}
         header='Singkron Jadwal Anggaran Penatausahaan'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-semibold'>Proses membutuhkan waktu.</span>
         </p>
         <p className='text-small'>
            Data Jadwal Anggara Penatausahaan akan diganti dengan data dari SIPD-Penatausahaan.
            Apakah anda yakin?
         </p>
      </DialogConfirm>
   )
}
export default ModalSingkronJadwal

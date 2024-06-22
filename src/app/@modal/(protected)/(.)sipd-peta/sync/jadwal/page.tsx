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
      toast('Sedang mengambil data jadwal dari sipd', { toastId: 'singkron_data', isLoading: true })
      try {
         const { id_daerah, tahun } = validateSipdPetaSession(session)
         await syncJadwalAnggaranPenatausahaan({ id_daerah, tahun })
         toast.update('singkron_data', {
            render: `Selesai singkron data jadwal anggaran penatausahaan`,
            isLoading: false,
            autoClose: 2000,
            type: 'info',
         })
         return true
      } catch (error: any) {
         toast.update('singkron_data', {
            render: error?.message || 'Gagal singkron data jadwal',
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

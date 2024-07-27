'use client'

import { getListTahapanSipd, syncTahapanSipd } from '@actions/perencanaan/data/tahapan'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { TahapanUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const ModalSingkronTahapan = () => {
   const { data } = useSession()
   const action = async () => {
      try {
         toast('Mengambil data tahapan', { toastId: 'sync_data', isLoading: true })

         const session = validateSipdSession(data)
         let tahapanResponse = await getListTahapanSipd({
            id_daerah: session.id_daerah,
            tahun: session.tahun,
            length: 500,
         })

         if (tahapanResponse?.recordsTotal > tahapanResponse?.data?.length) {
            tahapanResponse = await getListTahapanSipd({
               ...session,
               length: tahapanResponse.recordsTotal,
            })
         }

         const tahapanData = TahapanUncheckedCreateInputSchema.array()
            .min(1)
            .parse(tahapanResponse.data.map((tahapan) => ({ ...tahapan, is_active: false })))

         const syncResponse = await syncTahapanSipd(tahapanData)

         toast.update('sync_data', {
            render: syncResponse.data?.message || 'Data tahapan berhasil disinkronisasi',
            isLoading: false,
            autoClose: 2000,
            type: syncResponse.success ? 'success' : 'error',
         })
         return syncResponse.success
      } catch (error) {
         const errorMessage =
            error instanceof Error ? error.message : 'Gagal menyinkronkan data tahapan'
         toast.done('sync_data')
         toast.error(errorMessage)
         return false
      }
   }
   return (
      <DialogConfirm
         action={action}
         data_key={['data_tahapan', 'jadwal_anggaran']}
         header='Singkron data tahapan'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Proses tidak dapat dibatalkan.</span>
         </p>
         <p className='text-small'>
            Data Tahapan akan diganti dengan data dari SIPD-RI. Apakah anda yakin?
         </p>
      </DialogConfirm>
   )
}
export default ModalSingkronTahapan

'use client'

import { useState } from 'react'
import {
   getJadwalAnggaranAktifFromSipd,
   getTotalJadwalAnggaran,
   syncJadwalAnggaranAktifSipd,
   syncJadwalAnggaranSipd,
} from '@actions/perencanaan/rka/jadwal-anggaran'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { JadwalAnggaranUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'

const ModalSingkronJadwal = () => {
   const [isLoading, setIsLoading] = useState(false)
   const { data } = useSession()
   const action = async () => {
      setIsLoading(true)
      toast('Sedang mengambil data jadwal dari sipd', { toastId: 'singkron_data', isLoading: true })
      try {
         const { id_daerah, tahun } = validateSipdSession(data)
         const res = await getJadwalAnggaranAktifFromSipd({
            id_daerah,
            tahun,
         }).catch(() => {
            throw new Error('Gagal mengambil data jadwal aktif dari sipd')
         })

         const length_old = await getTotalJadwalAnggaran({ id_daerah, limit: 1, tahun }).then(
            (d) => d.totalCount
         )
         if (!res.length) {
            throw new Error('Data jadwal tidak ada')
         }

         const dataForSync = res.map((jadwal) => ({
            ...jadwal,
            is_active: 1,
            waktu_mulai: new Date(jadwal.waktu_mulai.replace(' GMT', '')),
            waktu_selesai: new Date(jadwal.waktu_selesai.replace(' GMT', '')),
         }))

         const messagePrefix =
            length_old > 0 ? 'Sedang Update data jadwal' : 'Sedang tambah data Jadwal'
         toast.update('singkron_data', { render: messagePrefix })

         const validData =
            length_old > 0
               ? JadwalAnggaranUncheckedCreateInputSchema.parse(dataForSync[0])
               : JadwalAnggaranUncheckedCreateInputSchema.array().min(1).max(1).parse(dataForSync)

         const syncFunction = length_old > 0 ? syncJadwalAnggaranAktifSipd : syncJadwalAnggaranSipd

         // @ts-expect-error
         const syncResult = await syncFunction(validData).then((result) => {
            const successMessage =
               result?.message ||
               (length_old > 0 ? 'Berhasil aktivasi data Jadwal' : 'Berhasil tambah data Jadwal')
            toast.update('singkron_data', {
               render: successMessage,
               isLoading: false,
               autoClose: 2000,
               type: result?.success ? 'success' : 'error',
            })
            return !!result.success
         })
         setIsLoading(false)
         return syncResult
      } catch (error: any) {
         toast.update('singkron_data', {
            render: error?.message || 'Gagal singkron data jadwal',
            isLoading: false,
            autoClose: 2000,
            type: 'error',
         })
         setIsLoading(false)
         return false
      }
   }
   return (
      <DialogConfirm
         header='Singkron Jadwal Penganggaran'
         action={action}
         data_key={['jadwal_anggaran', 'jadwal_anggaran_aktif', 'perencanaan']}>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Proses tidak dapat dibatalkan.</span>
         </p>
         <p className='text-small'>
            Data Jadwal Penganggaran yang sedang aktif akan diganti dengan data dari SIPD-RI. Apakah
            anda yakin?
         </p>
      </DialogConfirm>
   )
}
export default ModalSingkronJadwal

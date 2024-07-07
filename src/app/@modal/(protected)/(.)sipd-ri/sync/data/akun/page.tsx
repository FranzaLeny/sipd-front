'use client'

import { useCallback, useState } from 'react'
import { geAllAkunSipd, syncAkun } from '@actions/perencanaan/data/akun'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { AkunUncheckedCreateInputSchema } from '@zod'
import { toast, ToastContent } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'
import { processChunks } from '@shared/utils/hof'

const ModalSingkron = () => {
   const { data: session } = useSession()
   const [lengthData, setLengthData] = useState(500)
   const [isValid, setIsValid] = useState(false)

   const action = useCallback(async () => {
      const toastId = 'singkron_data'
      const startProgress = 0.1
      const endProgress = 1.0

      toast(
         <div>
            <p className='font-bold'>Mohon tunggu...</p>
            <p>Proses sedang berjalan</p>
         </div>,
         {
            toastId,
            isLoading: true,
            progress: 0,
         }
      )

      try {
         if (!isValid) {
            throw new Error('Maksimal data tidak valid')
         }
         const user = validateSipdSession(session)
         const data = await geAllAkunSipd(user)?.then((res) =>
            res?.map((akun) => {
               let level = akun?.level
               const kode = akun?.kode_akun?.split('.')
               if (!level && kode?.length) {
                  level = kode.length
               }
               return { ...akun, tahun: [akun.tahun], level }
            })
         )
         if (!data?.length) {
            throw new Error('Tidak ada data untuk disingkronkan')
         }
         toast.update(toastId, {
            render: (
               <div>
                  <p className='font-bold'>Mohon tunggu...</p>
                  <p>Sedang singkron data akun</p>
               </div>
            ),
            progress: startProgress,
         })

         await processChunks({
            data,
            action: syncAkun,
            max: lengthData,
            schema: AkunUncheckedCreateInputSchema,
            onSuccess: (res, progress, n) => {
               const message = res?.data?.message ?? 'Berhasil singkron data'
               toast.update(toastId, {
                  render: (
                     <div>
                        <p className='font-bold'>Proses ke {n} berhasil</p>
                        <p>{message}</p>
                     </div>
                  ),
                  progress: startProgress + (endProgress - startProgress) * progress,
               })
            },
            onError: (err: any, progress, n) => {
               const message = err?.message ?? 'Gagal singkron data'
               toast.error(
                  <div>
                     <p className='font-bold'>Proses ke {n} gagal</p>
                     <p>{message}</p>
                  </div>,
                  {
                     progress: startProgress + (endProgress - startProgress) * progress,
                  }
               )
            },
         })

         toast.success(`Selesai singkron ${data.length} data akun`)
         return true
      } catch (error: any) {
         const errMsg = error?.message || 'Gagal singkron data akun'
         if (typeof errMsg === 'string') {
            let message: ToastContent = errMsg
            const messages = errMsg?.split?.('\n')
            if (messages?.length > 1) {
               message = (
                  <div>
                     {messages?.map((msg, i) => (
                        <p
                           key={i}
                           className={`${i === 0 ? 'font-bold' : 'italic'}`}>
                           {msg}
                        </p>
                     ))}
                  </div>
               )
            } else {
               message = (
                  <div>
                     <p className='font-bold'>Terjadi Kesalahan</p>
                     <p>{message}</p>
                  </div>
               )
            }
            toast.error(message)
         }
         return false
      } finally {
         toast.done(toastId)
      }
   }, [session, lengthData, isValid])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!isValid}
         data_key={['data_akun', 'perencanaan']}
         header='Singkron data akun'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Saat proses tidak dapat dibatalkan.</span>
         </p>
         <MaxDataInput
            defaultValue={lengthData}
            onValidate={setIsValid}
            onValueChange={setLengthData}
         />
         <p className='text-small'>
            Data Akun akan diganti dengan data dari SIPD-RI.. Apakah anda yakin?
         </p>
      </DialogConfirm>
   )
}
export default ModalSingkron

'use client'

import { useCallback, useState } from 'react'
import { getListSatuanSipd, syncSatuan } from '@actions/perencanaan/data/satuan'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { SatuanUncheckedCreateInputSchema } from '@zod'
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
            <p>Sedang mengambil data satuan dari sipd</p>
         </div>,
         {
            toastId,
            isLoading: true,
            progress: 0,
         }
      )

      if (!isValid) {
         throw new Error('Maksimal data tidak valid')
      }

      try {
         const data = await getListSatuanSipd({ length: 10000 }).then((res) => res.data)

         if (!data?.length) {
            throw new Error('Tidak ada data satuan')
         }
         toast.update(toastId, {
            render: (
               <div>
                  <p className='font-bold'>Mohon tunggu...</p>
                  <p>Sedang simpan data satuan</p>
               </div>
            ),
            progress: startProgress,
         })

         await processChunks({
            data,
            action: syncSatuan,
            max: lengthData,
            schema: SatuanUncheckedCreateInputSchema,
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

         toast.success(`Selesai singkron ${data.length} data satuan`)
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
   }, [lengthData, isValid])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!isValid && !session}
         data_key={['data_satuan', 'perencanaan']}
         header='Singkron data Satuan'>
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

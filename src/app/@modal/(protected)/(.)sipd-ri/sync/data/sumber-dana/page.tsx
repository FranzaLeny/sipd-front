'use client'

import { useCallback, useState } from 'react'
import {
   deleteOldSumberDana,
   getAllSumberDanaSipd,
   syncSumberDana,
} from '@actions/perencanaan/data/sumber-dana'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { SumberDanaUncheckedCreateInputSchema } from '@zod'
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
            <p>Sedang mengambil data sumber dana dari sipd</p>
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
         const { id_daerah, tahun } = validateSipdSession(session)
         const sync_at = Date.now()
         const data = await getAllSumberDanaSipd({ id_daerah, tahun, length: 1 }).then((res) =>
            res.data?.map((d) => ({ ...d, tahun: !!d?.tahun ? d.tahun : tahun, sync_at }))
         )

         if (!data?.length) {
            throw new Error('Tidak ada data sumber dana')
         }
         toast.update(toastId, {
            render: (
               <div>
                  <p className='font-bold'>Mohon tunggu...</p>
                  <p>Sedang simpan data sumber dana</p>
               </div>
            ),
            progress: startProgress,
         })

         await processChunks({
            data,
            action: syncSumberDana,
            max: lengthData,
            schema: SumberDanaUncheckedCreateInputSchema,
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
         await deleteOldSumberDana({ id_daerah, sync_at, tahun })
         toast.success(`Selesai singkron ${data.length} data sumber dana`)
         return true
      } catch (error: any) {
         const errMsg = error?.message || 'Gagal singkron data sumber dana'
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
   }, [lengthData, isValid, session])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!isValid && !session}
         data_key={['data_sumber_dana', 'perencanaan']}
         header='Singkron data sumber dana'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Saat proses tidak dapat dibatalkan.</span>
         </p>
         <MaxDataInput
            defaultValue={lengthData}
            onValidate={setIsValid}
            onValueChange={setLengthData}
         />
         <p className='text-small'>
            Data Sumber Dana akan diganti dengan data dari SIPD-RI.. Apakah anda yakin?
         </p>
      </DialogConfirm>
   )
}
export default ModalSingkron

'use client'

import { useCallback, useState } from 'react'
import { getListSatuanSipd, syncSatuan } from '@actions/perencanaan/data/satuan'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { SatuanUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
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

      toast('Sedang mengambil data satuan dari sipd', {
         toastId,
         isLoading: true,
         progress: 0,
      })

      if (!isValid) {
         toast.error('Maksimal data tidak valid')
         return false
      }

      try {
         const data = await getListSatuanSipd({ length: 10000 }).then((res) => res.data)

         if (!data?.length) {
            throw new Error('Tidak ada data untuk disingkronkan')
         }

         toast.update(toastId, {
            render: `Singkron data satuan`,
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
                  render: `${message} KE- ${n}`,
                  progress: startProgress + (endProgress - startProgress) * progress,
               })
            },
            onError: (err: any, progress, n) => {
               const message = err?.message ?? 'Gagal singkron data'
               toast.error(`${message} KE- ${n}`, {
                  progress: startProgress + (endProgress - startProgress) * progress,
               })
            },
         })

         toast.success(`Selesai singkron ${data.length} data satuan`)
      } catch (error: any) {
         toast.error(error.message || 'Gagal singkron data satuan')
      } finally {
         toast.done(toastId)
      }

      return true
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

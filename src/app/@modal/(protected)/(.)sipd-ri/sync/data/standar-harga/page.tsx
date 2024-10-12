'use client'

import { useCallback, useState } from 'react'
import {
   deleteOldStandarHarga,
   getAllStandarHargaSipd,
   syncStandarHaga,
} from '@actions/perencanaan/data/standar-harga'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput, PilihTipes, Tipes } from '@components/perencanaan/sync-input'
import { tipeToKelompok } from '@utils/standar-harga'
import { StandarHargaDeleteOldParamsSchema, StandarHargaUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'
import { processChunks } from '@shared/utils/hof'

const ModalSingkron = () => {
   const { data: session } = useSession()
   const [lengthData, setLengthData] = useState(500)
   const [tipes, setTipes] = useState<Tipes[]>(['SBU'])
   const [isValidTipes, setIsValidTipes] = useState(false)
   const [isValidLength, setIsValidLength] = useState(false)

   const action = useCallback(async () => {
      const toastId = 'singkron_data'
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

      if (!isValidTipes || !isValidLength) {
         throw new Error('Inputan tidak valid')
      }

      const user = validateSipdSession(session)
      let progressStart = 0
      const totalProcess = 2 * tipes.length
      const progressIncrement = 1 / totalProcess
      try {
         const sync_at = Date.now()
         for (const tipe of tipes) {
            toast.update(toastId, {
               render: (
                  <div>
                     <p className='font-bold'>Mohon tunggu...</p>
                     <p>Chek data standar harga {tipe} dari SIPD-RI</p>
                  </div>
               ),
               progress: progressStart,
            })
            // PROCESS 1
            const data = await getAllStandarHargaSipd(
               {
                  id_daerah: user.id_daerah,
                  tahun: user.tahun,
                  tipe,
                  length: lengthData,
                  start: 0,
               },
               sync_at
            ).catch((error) => {
               throw new Error(
                  `Gagal mengambil data standar harga ${tipe} dari SIPD: ${error.message}`
               )
            })
            toast.update(toastId, {
               render: (
                  <div>
                     <p className='font-bold'>Mohon tunggu...</p>
                     <p>Selesai chek data standar harga {tipe} dari SIPD-RI</p>
                  </div>
               ),
               progress: progressStart + progressIncrement,
            })
            progressStart += progressIncrement
            // PROCESS 2
            if (data?.length) {
               await processChunks({
                  data,
                  action: syncStandarHaga,
                  max: lengthData,
                  schema: StandarHargaUncheckedCreateInputSchema,
                  onSuccess: (res, progress, n) => {
                     const message = res?.data?.message ?? `Berhasil singkron data ${tipe}`
                     toast.update(toastId, {
                        render: (
                           <div>
                              <p className='font-bold'>
                                 Proses simpa data {tipe} ke {n}
                              </p>
                              <p>{message}</p>
                           </div>
                        ),
                        progress: progressStart + progressIncrement * progress,
                     })
                  },
                  onError: (err: any, progress, n) => {
                     const message = err?.message ?? 'Gagal singkron data'
                     toast.error(
                        <div>
                           <p className='font-bold'>
                              Proses simpa data {tipe} ke {n}
                           </p>
                           <p>{message}</p>
                        </div>,
                        {
                           progress: progressStart + progressIncrement * progress,
                        }
                     )
                  },
               })
               const usedData = StandarHargaDeleteOldParamsSchema.parse({
                  id_daerah: user?.id_daerah,
                  tahun: user?.tahun,
                  sync_at,
                  kelompok: tipeToKelompok(tipe),
                  total_data: data?.length,
               })
               await deleteOldStandarHarga(usedData)
            }
            progressStart += progressIncrement
         }

         toast.success(`Selesai singkron data standar harga ${tipes.join(' ')}`)
      } catch (error: any) {
         toast.error(`Gagal singkron data standar harga ${tipes.join(' ')}: ${error?.message}`)
      } finally {
         toast.done(toastId)
      }
      return true
   }, [session, isValidTipes, isValidLength, lengthData, tipes])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!isValidTipes && !isValidLength}
         data_key={['data_standar_harga']}
         header='Singkron data standar harga'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Proses tidak dapat dibatalkan.</span>
         </p>
         <MaxDataInput
            defaultValue={lengthData}
            onValidate={setIsValidLength}
            onValueChange={setLengthData}
         />
         <PilihTipes
            onValidate={setIsValidTipes}
            defaultValue={tipes}
            onValueChange={setTipes}
         />
         <p className='text-small'>
            Data Standar Harga akan diganti dengan data dari SIPD-RI. Apakah anda yakin?
         </p>
      </DialogConfirm>
   )
}
export default ModalSingkron

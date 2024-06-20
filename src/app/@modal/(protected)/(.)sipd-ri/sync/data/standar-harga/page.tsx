'use client'

import { useCallback, useState } from 'react'
import { getAllStandarHargaSipd, syncStandarHaga } from '@actions/perencanaan/data/standar-harga'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput, PilihTipes, Tipes } from '@components/perencanaan/sync-input'
import { StandarHargaUncheckedCreateInputSchema } from '@zod'
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
      toast('Mohon tunggu...', {
         toastId,
         isLoading: true,
         progress: 0,
         closeButton: false,
      })

      if (!isValidTipes || !isValidLength) {
         toast.error('Data tidak sesuai periksa kembali')
         return false
      }

      const user = validateSipdSession(session)
      let progressStart = 0.01
      const progressIncrement = (1 - progressStart) / tipes.length

      try {
         for (const tipe of tipes) {
            toast.update(toastId, {
               render: `Chek data standar harga ${tipe} dari SIPD-RI`,
               progress: progressStart,
            })

            const data = await getAllStandarHargaSipd({
               id_daerah: user.id_daerah,
               tahun: user.tahun,
               tipe,
               length: lengthData,
               start: 0,
            }).catch((error) => {
               throw new Error(`Gagal mengambil data standar harga dari SIPD: ${error.message}`)
            })

            toast.update(toastId, {
               render: `Berhasil Chek data standar harga ${tipe} dari SIPD-RI`,
               progress: progressStart + progressIncrement / 2,
            })

            progressStart += progressIncrement / 2

            if (data?.length) {
               await processChunks({
                  data,
                  action: syncStandarHaga,
                  max: lengthData,
                  schema: StandarHargaUncheckedCreateInputSchema,
                  onSuccess: (res, progress, n) => {
                     toast.update(toastId, {
                        render: `${res?.data?.message ?? 'Berhasil singkron data'}  KE- ${n}`,
                        progress: progressStart + (progressIncrement / 2) * progress,
                     })
                  },
                  onError: (err: any, progress, n) => {
                     toast.error(`${err?.message ?? 'Gagal singkron data'}  KE- ${n}`)
                  },
               })
            }

            progressStart += progressIncrement / 2
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

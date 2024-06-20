'use client'

import { useCallback, useState } from 'react'
import { getListNewSkpdSipd, syncSkpdSipd, viewSkdSipd } from '@actions/perencanaan/data/skpd'
import { validateSipdSession } from '@actions/perencanaan/token-sipd'
import DialogConfirm from '@components/modal/dialog-confirm'
import { MaxDataInput } from '@components/perencanaan/sync-input'
import { SkpdUncheckedCreateInputSchema } from '@zod'
import { toast } from 'react-toastify'
import { useSession } from '@shared/hooks/use-session'
import { processChunks } from '@shared/utils/hof'

const ModalSingkron = () => {
   const { data: session } = useSession()
   const [lengthData, setLengthData] = useState(100)
   const [isValid, setIsValid] = useState(false)

   const onSuccess = (res: any, progress: number, n: number) => {
      toast.update('singkron_data', {
         render: `${res?.data?.message ?? 'Berhasil singkron data'}  KE- ${n}`,
         progress: 0.5 + 0.5 * progress,
      })
   }
   const onError = (err: any, progress: number, n: number) => {
      toast.error(`${err?.message ?? 'Gagal singkron data'}  KE- ${n}`, {
         progress: 0.5 + 0.5 * progress,
      })
   }

   const action = useCallback(async () => {
      try {
         if (!isValid) throw new Error('Maksimal data tidak valid')
         toast('Sedang mengambil data skpd dari sipd', {
            toastId: 'singkron_data',
            isLoading: true,
            closeButton: false,
            progress: 0.001,
         })
         const user = validateSipdSession(session)
         const data_opd = await getListNewSkpdSipd(user)
            .then((res) => res.data)
            .catch((e: any) => {
               console.error(e?.message)
               throw new Error('Gagal mengambil data skpd dari sipd')
            })

         const data: SkpdView[] = await Promise.all(
            data_opd.map(async (temp) => {
               return viewSkdSipd({
                  id_daerah: temp.id_daerah,
                  id_skpd: temp.id_skpd,
                  tahun: temp.tahun,
               }).then((res) => res.data[0])
            })
         ).catch((d) => {
            throw new Error('Gagal mengambil detail data skpd dari sipd')
         })
         toast.update('singkron_data', {
            render: `Singkron data SKPD`,
            progress: 0.5,
         })
         if (data.length) {
            await processChunks({
               data,
               action: syncSkpdSipd,
               max: lengthData,
               onSuccess,
               onError,
               schema: SkpdUncheckedCreateInputSchema,
            })
         }
         toast.success(`Selesai singkron ${data.length} data skpd`)
         toast.done('singkron_data')
         return true
      } catch (error: any) {
         toast.error(error?.message || 'Gagal singkron data skpd')
         toast.done('singkron_data')
         return false
      }
   }, [session, lengthData, isValid])

   return (
      <DialogConfirm
         action={action}
         disabledSubmit={!isValid}
         data_key={['data_skpd', 'perencanaan']}
         header='Singkron data skpd'>
         <p className='border-warning rounded-small border p-1 text-center'>
            PERHATIAN!! <span className='font-normal'>Proses tidak dapat dibatalkan.</span>
         </p>
         <MaxDataInput
            defaultValue={lengthData}
            onValidate={setIsValid}
            onValueChange={setLengthData}
         />
         <p className='text-small'>
            Data SKPD akan diganti dengan data dari SIPD-RI.. Apakah anda yakin?
         </p>
      </DialogConfirm>
   )
}
export default ModalSingkron
